import {
  AggregateID,
  BaseEntityProps,
  DomainDateTime,
  formatError,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@/core/shared";
import { AnthroSystemCodes, DATA_FIELD_CODE_TYPE } from "@/core/constants";
import { GetLatestValuesUntilDateRequest } from "./Request";
import {
  GetLastestValuesUnitlDateDto,
  GetLatestValuesUntilDateResponse,
} from "./Response";
import {
  AnthropometricRecord,
  CreateAnthropometricRecord,
  DataFieldResponse,
  DataFieldResponseValue,
  IAnthropometricRecord,
  IBiologicalValueRecord,
  IClinicalSignDataRecord,
  IComplicationDataRecord,
  IDataFieldResponse,
  INormalizeAnthropometricDataACL,
  INormalizeDataFieldResponseAcl,
  MedicalRecord,
  MedicalRecordRepository,
  IAppetiteTestRecord,
} from "@/core/medical_record/domain";
import {
  AppetiteTestResultDto,
  IAppetiteTestAppService,
} from "@/core/evaluation";

export class GetLatestValuesUntilDateUseCase
  implements
    UseCase<GetLatestValuesUntilDateRequest, GetLatestValuesUntilDateResponse>
{
  constructor(
    private readonly medicalRecordRepo: MedicalRecordRepository,
    private readonly normalizeAnthropDataACL: INormalizeAnthropometricDataACL,
    private readonly normalizeDataFieldRespnseACL: INormalizeDataFieldResponseAcl,
    private readonly evaluateAppetiteTestService: IAppetiteTestAppService
  ) {}
  async execute(
    request: GetLatestValuesUntilDateRequest
  ): Promise<GetLatestValuesUntilDateResponse> {
    try {
      const dateRes = DomainDateTime.create(request.datetime);
      if (dateRes.isFailure) {
        return left(dateRes);
      }
      const medicalRecord = await this.getMedicalRecord(
        request.patientOrMedicalRecordId
      );
      const medicalRecordUntilDateRes = this.getAllLatestValuesUntilDate(
        medicalRecord,
        dateRes.val
      );
      if (medicalRecordUntilDateRes.isFailure) {
        return left(medicalRecordUntilDateRes);
      }
      const normalizationResult = await this.normalizeNecessaryData(
        medicalRecordUntilDateRes.val
      );
      if (normalizationResult.isFailure) {
        return left(normalizationResult);
      }
      return right(Result.ok(normalizationResult.val));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }

  private async getMedicalRecord(id: AggregateID): Promise<MedicalRecord> {
    return this.medicalRecordRepo.getByPatientIdOrID(id);
  }

  private getAllLatestValuesUntilDate(
    medicalRecord: MedicalRecord,
    date: DomainDateTime
  ) {
    try {
      return Result.ok({
        anthropometric:
          medicalRecord.getLatestAnthropometricDataUntilDate(date),
        dataFields: medicalRecord.getLatestDataFieldDataUntilDate(date),
        clinicalData: medicalRecord.getLatestClinicalDataUntilDate(date),
        biological: medicalRecord.getLatestBiologicalDataUntilDate(date),
        complication: medicalRecord.getLatestComplicationDataUntilDate(date),
        appetiteTest: medicalRecord.getLatestAppetiteTestDataUntilDate(date),
      });
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  private async normalizeNecessaryData(data: {
    anthropometric: (IAnthropometricRecord & BaseEntityProps)[];
    dataFields: (IDataFieldResponse & BaseEntityProps)[];
    clinicalData: (IClinicalSignDataRecord & BaseEntityProps)[];
    biological: (IBiologicalValueRecord & BaseEntityProps)[];
    complication: (IComplicationDataRecord & BaseEntityProps)[];
    appetiteTest: IAppetiteTestRecord & BaseEntityProps;
  }): Promise<Result<GetLastestValuesUnitlDateDto>> {
    try {
      const anthropometricRes = await this.normalizeAnthropometriData(
        data.anthropometric
      );
      const dataFieldsRes = await this.normalizeDataFieldResponse(
        data.dataFields
      );
      const normalizeAppetiteTestRes = await this.normalizeAppetiteTest(
        data.appetiteTest,
        anthropometricRes.val
      );

      const combinedRes = Result.combine([
        anthropometricRes,
        dataFieldsRes,
        normalizeAppetiteTestRes,
      ]);
      if (combinedRes.isFailure) {
        return Result.fail(
          formatError(combinedRes, GetLatestValuesUntilDateUseCase.name)
        );
      }

      return Result.ok({
        anthropometric: anthropometricRes.val,
        biological: data.biological.map(
          ({ id, createdAt, updatedAt, recordedAt, ...props }) => ({
            code: props.code.unpack(),
            unit: props.unit.unpack(),
            value: props.value,
          })
        ),
        clinical: data.clinicalData.map(
          ({ id, createdAt, updatedAt, recordedAt, ...props }) => ({
            code: props.code.unpack(),
            data: props.data,
            isPresent: props.isPresent,
          })
        ),
        dataFields: dataFieldsRes.val.map(({ code, value }) => ({
          code,
          data: value,
        })),
        complication: data.complication.map(
          ({ id, createdAt, updatedAt, ...props }) => ({
            code: props.code.unpack(),
            isPresent: props.isPresent,
          })
        ),
        appetiteTest: normalizeAppetiteTestRes.val,
      });
    } catch (e: unknown) {
      return handleError(e);
    }
  }
  private async normalizeDataFieldResponse(
    fieldsResponse: (IDataFieldResponse & BaseEntityProps)[]
  ): Promise<
    Result<{ code: DATA_FIELD_CODE_TYPE; value: DataFieldResponseValue }[]>
  > {
    try {
      const dataFieldResponses = fieldsResponse.map(
        ({ id, createdAt, updatedAt, ...props }) =>
          new DataFieldResponse({ props, id, createdAt, updatedAt })
      );
      const normalizationResults =
        await this.normalizeDataFieldRespnseACL.normalize(dataFieldResponses);
      if (normalizationResults.isFailure) {
        return Result.fail(
          formatError(
            normalizationResults,
            GetLatestValuesUntilDateUseCase.name
          )
        );
      }
      return Result.ok(normalizationResults.val);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
  private async normalizeAppetiteTest(
    appetiteTest: IAppetiteTestRecord,
    anthropometricNormalized: CreateAnthropometricRecord[]
  ): Promise<Result<AppetiteTestResultDto>> {
    try {
      const patientWeight = anthropometricNormalized.find(
        item => item.code === AnthroSystemCodes.WEIGHT
      );
      if (patientWeight === undefined) {
        return Result.fail(
          "Patient weight is undefined. Please provide the patient's weight."
        );
      }
      const appetiteTestEvaluationRes =
        await this.evaluateAppetiteTestService.evaluateAppetite({
          givenProductType: appetiteTest.productType,
          takenAmount:
            "fraction" in appetiteTest.amount
              ? { takenFraction: appetiteTest.amount.fraction }
              : { takenQuantity: appetiteTest.amount.quantity },
          patientWeight: patientWeight.value,
        });
      if ("content" in appetiteTestEvaluationRes) {
        const { content } = appetiteTestEvaluationRes;
        return Result.fail(JSON.parse(content));
      }
      return Result.ok(appetiteTestEvaluationRes.data);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
  private async normalizeAnthropometriData(
    anthropometricData: (IAnthropometricRecord & BaseEntityProps)[]
  ): Promise<Result<CreateAnthropometricRecord[]>> {
    try {
      const anthropometricRecords = anthropometricData.map(
        ({ id, updatedAt, createdAt, ...props }) =>
          new AnthropometricRecord({ id, createdAt, updatedAt, props })
      );
      const normalizationResults = await Promise.all(
        anthropometricRecords.map(field =>
          this.normalizeAnthropDataACL.normalize(field)
        )
      );
      const combinedRes = Result.combine(normalizationResults);
      if (combinedRes.isFailure) {
        return Result.fail(
          formatError(combinedRes, GetLatestValuesUntilDateUseCase.name)
        );
      }
      return Result.ok(
        normalizationResults.map(res => {
          const data = res.val;
          return {
            code: data.getCode(),
            context: data.getContext(),
            ...data.getMeasurement(),
          };
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
