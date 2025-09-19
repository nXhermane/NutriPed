import {
  AggregateID,
  formatError,
  handleError,
  left,
  Result,
  right,
  SystemCode,
  UnitCode,
  UseCase,
} from "@shared";
import { UpdateMedicalRecordRequest } from "./Request";
import { UpdateMedicalRecordResponse } from "./Response";
import {
  DataFieldResponse,
  IClinicalSignDataInterpretationACL,
  MeasurementValidationACL,
  MedicalRecord,
  MedicalRecordRepository,
} from "./../../../../domain";

export class UpdateMedicalRecordUseCase
  implements UseCase<UpdateMedicalRecordRequest, UpdateMedicalRecordResponse>
{
  constructor(
    private readonly repo: MedicalRecordRepository,
    private measureValidation: MeasurementValidationACL,
    private readonly clinicalAnalysisMaker: IClinicalSignDataInterpretationACL
  ) {}
  async execute(
    request: UpdateMedicalRecordRequest
  ): Promise<UpdateMedicalRecordResponse> {
    try {
      const medicalRecord = await this.repo.getByPatientIdOrID(
        request.medicalRecordId
      );
      const updatedRes = await this.updateMedicalRecord(
        medicalRecord,
        request.data
      );
      if (updatedRes.isFailure) return left(updatedRes);

      const validationRes = await this.validateMeasurement(medicalRecord);
      if (validationRes.isFailure) return left(validationRes);

      await this.repo.save(medicalRecord);
      return right(Result.ok(void 0));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }

  private async validateMeasurement(
    medicalRecord: MedicalRecord
  ): Promise<Result<boolean>> {
    const { anthropometricData, biologicalData, clinicalData } =
      medicalRecord.getProps();
    return await this.measureValidation.validate(medicalRecord.getPatientId(), {
      anthropometricData,
      clinicalData,
      biologicalData,
    });
  }
  private async updateMedicalRecord(
    medicalRecord: MedicalRecord,
    data: UpdateMedicalRecordRequest["data"]
  ): Promise<Result<boolean>> {
    try {
      if (data.anthropometricData) {
        const anthropResError: Result<any>[] = [];
        data.anthropometricData.forEach(anthrop => {
          const unitRes = UnitCode.create(anthrop.measurement.unit);
          if (unitRes.isFailure) {
            anthropResError.push(unitRes);
          } else {
            const measurement = {
              unit: unitRes.val,
              value: anthrop.measurement.value,
            };
            medicalRecord.changeAnthropometricRecord(anthrop.id, measurement);
          }
        });
        const combinedRes = Result.combine(anthropResError);
        if (combinedRes.isFailure)
          return Result.fail(
            formatError(combinedRes, UpdateMedicalRecordUseCase.name)
          );
      }
      if (data.biologicalData) {
        const biologicalResError: Result<any>[] = [];
        data.biologicalData.forEach(test => {
          const unitRes = UnitCode.create(test.measurement.unit);
          if (unitRes.isFailure) biologicalResError.push(unitRes);
          else {
            const measurement = {
              unit: unitRes.val,
              value: test.measurement.value,
            };
            medicalRecord.changeBiologicalDataRecord(test.id, measurement);
          }
        });
        const combinedRes = Result.combine(biologicalResError);
        if (combinedRes.isFailure)
          return Result.fail(
            formatError(combinedRes, UpdateMedicalRecordUseCase.name)
          );
      }
      if (data.dataFieldResponses) {
        const dataFieldRes = data.dataFieldResponses.map(props =>
          DataFieldResponse.create(props.data, props.id)
        );
        const combinedRes = Result.combine(dataFieldRes);
        if (combinedRes.isFailure)
          return Result.fail(
            formatError(combinedRes, UpdateMedicalRecordUseCase.name)
          );
        data.dataFieldResponses.map(field =>
          medicalRecord.changeDataFields(field.id, field.data.data)
        );
      }
      if (data.clinicalData) {
        const clinicalResError: Result<any>[] = [];
        const processedClinicalSign: {
          id: AggregateID;
          data: object;
          isPresent: boolean;
        }[] = [];
        for (const sign of data.clinicalData) {
          const res = await this.clinicalAnalysisMaker.analyze(
            medicalRecord.getPatientId(),
            [sign]
          );
          if (res.isFailure) clinicalResError.push(res);
          processedClinicalSign.push({
            id: sign.id,
            data: sign.data,
            isPresent: res.val[0]?.isPresent ?? false,
          });
        }
        const combinedRes = Result.combine(clinicalResError);
        if (combinedRes.isFailure)
          return Result.fail(
            formatError(combinedRes, UpdateMedicalRecordUseCase.name)
          );
        processedClinicalSign.forEach(sign =>
          medicalRecord.changeClinicalDataRecord(sign.id, {
            clinicalSignData: sign.data,
            isPresent: sign.isPresent,
          })
        );
      }
      if (data.complicationData) {
        data.complicationData.forEach(complication => {
          medicalRecord.changeComplicationDataRecord(complication.id, {
            isPresent: complication.isPresent,
          });
        });
      }
      if (data.appetiteTests) {
        data.appetiteTests.forEach(test =>
          medicalRecord.changeAppetiteTest(test.id, test.data)
        );
      }
      if (data.orientationRecords) {
        for (const orientationRecord of data.orientationRecords) {
          const codeRes = orientationRecord.data.code
            ? SystemCode.create(orientationRecord.data.code)
            : Result.ok(undefined);
          const treatmentRes = orientationRecord.data.treatmentPhase
            ? SystemCode.create(orientationRecord.data.treatmentPhase)
            : Result.ok(undefined);
          const combinedRes = Result.combine([codeRes, treatmentRes as any]);
          if (combinedRes.isFailure) {
            return Result.fail(
              formatError(combinedRes, UpdateMedicalRecordUseCase.name)
            );
          }
          medicalRecord.changeOrientationRecord(orientationRecord.id, {
            code: codeRes.val,
            treatmentPhase: treatmentRes.val,
          });
        }
      }

      return Result.ok(true);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
