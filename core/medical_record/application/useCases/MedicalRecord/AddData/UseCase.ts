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
  MeasurementValidationACL,
  MedicalRecord,
  MedicalRecordRepository,
} from "./../../../../domain";

export class AddDataToMedicalRecordUseCase
  implements
    UseCase<AddDataToMedicalRecordRequest, AddDataToMedicalRecordResponse>
{
  constructor(
    private readonly repo: MedicalRecordRepository,
    private measureValidation: MeasurementValidationACL
  ) {}
  async execute(
    request: AddDataToMedicalRecordRequest
  ): Promise<AddDataToMedicalRecordResponse> {
    try {
      const medicalRecord = await this.repo.getByPatientIdOrID(
        request.medicalRecordId
      );
      const dataAddedRes = this.addDataToMedicalRecord(
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
  private addDataToMedicalRecord(
    medicalRecord: MedicalRecord,
    data: AddDataToMedicalRecordRequest["data"]
  ): Result<boolean> {
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
        const clinicalDataRes = data.clinicalData.map(ClinicalSignData.create);
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
