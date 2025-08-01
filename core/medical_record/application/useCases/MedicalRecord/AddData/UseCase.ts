import {
  formatError,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { AddDataToMedicalRecordRequest } from "./Request";
import { AddDataToMedicalRecordResponse } from "./Response";
import {
  AnthropometricData,
  BiologicalValue,
  ClinicalSignData,
  ComplicationData,
  DataFieldResponse,
  IClinicalSignDataInterpretationACL,
  MeasurementValidationACL,
  MedicalRecord,
  MedicalRecordRepository,
} from "./../../../../domain";

export class AddDataToMedicalRecordUseCase
  implements
  UseCase<AddDataToMedicalRecordRequest, AddDataToMedicalRecordResponse> {
  constructor(
    private readonly repo: MedicalRecordRepository,
    private readonly measureValidation: MeasurementValidationACL,
    private readonly clinicalAnalysisMaker: IClinicalSignDataInterpretationACL
  ) { }
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
        const anthropometricDataRes = data.anthropometricData.map(
          AnthropometricData.create
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
        const biologicalDataRes = data.biologicalData.map(
          BiologicalValue.create
        );
        const combinedRes = Result.combine(biologicalDataRes);
        if (combinedRes.isFailure)
          return Result.fail(
            formatError(combinedRes, AddDataToMedicalRecordUseCase.name)
          );
        biologicalDataRes.map(res => medicalRecord.addBiologicalValue(res.val));
      }
      if (data.clinicalData) {
        const clinicalAnalysisResult = await this.clinicalAnalysisMaker.analyze(medicalRecord.getPatientId(), data.clinicalData.map((item => ({
          code: item.code,
          data: item.data
        }))))
        if (clinicalAnalysisResult.isFailure) return Result.fail<boolean>(String(clinicalAnalysisResult.err))
        const clinicalData = data.clinicalData.map((item => {
          return {
            ...item,
            isPresent: clinicalAnalysisResult.val.find(value => item.code === value.code)?.isPresent || false
          }
        }))
        const clinicalDataRes = clinicalData.map((clinicalSign => ClinicalSignData.create(clinicalSign)))
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
        const complicationDataRes = data.complicationData.map(
          ComplicationData.create
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
      if (data.dataFieldResponse) {
        const dataFieldRes = data.dataFieldResponse.map(
          DataFieldResponse.create
        );
        const combinedRes = Result.combine(dataFieldRes);
        if (combinedRes.isFailure)
          return Result.fail(
            formatError(combinedRes, AddDataToMedicalRecordUseCase.name)
          );
        dataFieldRes.forEach(res => medicalRecord.addDataField(res.val));
      }
      return Result.ok(true);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
