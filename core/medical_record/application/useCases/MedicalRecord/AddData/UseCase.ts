import {
  formatError,
  GenerateUniqueId,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { AddDataToMedicalRecordRequest } from "./Request";
import { AddDataToMedicalRecordResponse } from "./Response";
import {
  AnthropometricRecord,
  AppetiteTestRecord,
  BiologicalValueRecord,
  ClinicalSingDataRecord,
  ComplicationDataRecord,
  DataFieldResponse,
  IClinicalSignDataInterpretationACL,
  MeasurementValidationACL,
  MedicalRecord,
  MedicalRecordRepository,
  OrientationRecord,
} from "./../../../../domain";

export class AddDataToMedicalRecordUseCase
  implements
    UseCase<AddDataToMedicalRecordRequest, AddDataToMedicalRecordResponse>
{
  constructor(
    private readonly idGenerator: GenerateUniqueId,
    private readonly repo: MedicalRecordRepository,
    private readonly measureValidation: MeasurementValidationACL,
    private readonly clinicalAnalysisMaker: IClinicalSignDataInterpretationACL
  ) {}
  async execute(
    request: AddDataToMedicalRecordRequest
  ): Promise<AddDataToMedicalRecordResponse> {
    try {
      const medicalRecord = await this.repo.getByPatientIdOrID(
        request.medicalRecordId
      );
      const dataAddedRes = await this.addDataToMedicalRecord(
        medicalRecord,
        request.data
      );

      if (dataAddedRes.isFailure) return left(dataAddedRes);

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
  private async addDataToMedicalRecord(
    medicalRecord: MedicalRecord,
    data: AddDataToMedicalRecordRequest["data"]
  ): Promise<Result<boolean>> {
    try {
      if (data.anthropometricData) {
        const anthropometricDataRes = data.anthropometricData.map(props =>
          AnthropometricRecord.create(
            props,
            this.idGenerator.generate().toValue()
          )
        );
        const combinedRes = Result.combine(anthropometricDataRes);
        if (combinedRes.isFailure)
          return Result.fail(
            formatError(combinedRes, AddDataToMedicalRecordUseCase.name)
          );
        anthropometricDataRes.forEach(res =>
          medicalRecord.addAnthropometricData(res.val)
        );
      }
      if (data.biologicalData) {
        const biologicalDataRes = data.biologicalData.map(props =>
          BiologicalValueRecord.create(
            props,
            this.idGenerator.generate().toValue()
          )
        );
        const combinedRes = Result.combine(biologicalDataRes);
        if (combinedRes.isFailure)
          return Result.fail(
            formatError(combinedRes, AddDataToMedicalRecordUseCase.name)
          );
        biologicalDataRes.map(res => medicalRecord.addBiologicalValue(res.val));
      }
      if (data.clinicalData) {
        const clinicalAnalysisResult = await this.clinicalAnalysisMaker.analyze(
          medicalRecord.getPatientId(),
          data.clinicalData.map(item => ({
            code: item.code,
            data: item.data,
          }))
        );
        if (clinicalAnalysisResult.isFailure)
          return Result.fail<boolean>(String(clinicalAnalysisResult.err));
        const clinicalData = data.clinicalData.map(item => {
          return {
            ...item,
            isPresent:
              clinicalAnalysisResult.val.find(value => item.code === value.code)
                ?.isPresent || false,
          };
        });
        const clinicalDataRes = clinicalData.map(clinicalSign =>
          ClinicalSingDataRecord.create(
            clinicalSign,
            this.idGenerator.generate().toValue()
          )
        );
        const combinedRes = Result.combine(clinicalDataRes);
        if (combinedRes.isFailure)
          return Result.fail(
            formatError(combinedRes, AddDataToMedicalRecordUseCase.name)
          );
        clinicalDataRes.forEach(res =>
          medicalRecord.addClinicalSignData(res.val)
        );
      }
      if (data.complicationData) {
        const complicationDataRes = data.complicationData.map(props =>
          ComplicationDataRecord.create(
            props,
            this.idGenerator.generate().toValue()
          )
        );
        const combinedRes = Result.combine(complicationDataRes);
        if (combinedRes.isFailure)
          return Result.fail(
            formatError(combinedRes, AddDataToMedicalRecordUseCase.name)
          );
        complicationDataRes.map(res =>
          medicalRecord.addComplicationData(res.val)
        );
      }
      if (data.dataFieldResponses) {
        const dataFieldRes = data.dataFieldResponses.map(props =>
          DataFieldResponse.create(props, this.idGenerator.generate().toValue())
        );
        const combinedRes = Result.combine(dataFieldRes);
        if (combinedRes.isFailure)
          return Result.fail(
            formatError(combinedRes, AddDataToMedicalRecordUseCase.name)
          );
        dataFieldRes.forEach(res => medicalRecord.addDataField(res.val));
      }
      if (data.appetiteTests) {
        const appetiteTestRes = data.appetiteTests.map(props =>
          AppetiteTestRecord.create(
            props,
            this.idGenerator.generate().toValue()
          )
        );
        const combinedRes = Result.combine(appetiteTestRes);
        if (combinedRes.isFailure) {
          return Result.fail(
            formatError(combinedRes, AddDataToMedicalRecordUseCase.name)
          );
        }
      }
      if (data.orientationRecords) {
        const orientationRecordRes = data.orientationRecords.map(props =>
          OrientationRecord.create(props, this.idGenerator.generate().toValue())
        );
        const combinedRes = Result.combine(orientationRecordRes);
        if (combinedRes.isFailure) {
          return Result.fail(
            formatError(combinedRes, AddDataToMedicalRecordUseCase.name)
          );
        }
        orientationRecordRes.map(res =>
          medicalRecord.addOrientationRecord(res.val)
        );
      }
      return Result.ok(true);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
