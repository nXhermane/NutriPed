import {
  formatError,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { UpdateMedicalRecordRequest } from "./Request";
import { UpdateMedicalRecordResponse } from "./Response";
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

export class UpdateMedicalRecordUseCase
  implements UseCase<UpdateMedicalRecordRequest, UpdateMedicalRecordResponse>
{
  constructor(
    private readonly repo: MedicalRecordRepository,
    private measureValidation: MeasurementValidationACL
  ) {}
  async execute(
    request: UpdateMedicalRecordRequest
  ): Promise<UpdateMedicalRecordResponse> {
    try {
      const medicalRecord = await this.repo.getByPatientIdOrID(
        request.medicalRecordId
      );
      const updatedRes = this.updateMedicalRecord(medicalRecord, request.data);
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
  private updateMedicalRecord(
    medicalRecord: MedicalRecord,
    data: UpdateMedicalRecordRequest["data"]
  ): Result<boolean> {
    try {
      if (data.anthropometricData) {
        const anthropometricDataRes = data.anthropometricData.map(
          AnthropometricData.create
        );
        const combinedRes = Result.combine(anthropometricDataRes);
        if (combinedRes.isFailure)
          return Result.fail(
            formatError(combinedRes, UpdateMedicalRecordUseCase.name)
          );
        medicalRecord.changeAnthropometricData(
          anthropometricDataRes.map(res => res.val)
        );
      }
      if (data.biologicalData) {
        const biologicalDataRes = data.biologicalData.map(
          BiologicalValue.create
        );
        const combinedRes = Result.combine(biologicalDataRes);
        if (combinedRes.isFailure)
          return Result.fail(
            formatError(combinedRes, UpdateMedicalRecordUseCase.name)
          );
        medicalRecord.changeBiologicalData(
          biologicalDataRes.map(res => res.val)
        );
      }
      if (data.clinicalData) {
        const clinicalDataRes = data.clinicalData.map(ClinicalSignData.create);
        const combinedRes = Result.combine(clinicalDataRes);
        if (combinedRes.isFailure)
          return Result.fail(
            formatError(combinedRes, UpdateMedicalRecordUseCase.name)
          );
        medicalRecord.changeClinicalData(clinicalDataRes.map(res => res.val));
      }
      if (data.complicationData) {
        const complicationDataRes = data.complicationData.map(
          ComplicationData.create
        );
        const combinedRes = Result.combine(complicationDataRes);
        if (combinedRes.isFailure)
          return Result.fail(
            formatError(combinedRes, UpdateMedicalRecordUseCase.name)
          );
        medicalRecord.changeComplicationData(
          complicationDataRes.map(res => res.val)
        );
      }
      if (data.dataFieldResponse) {
        const dataFieldRes = data.dataFieldResponse.map(
          DataFieldResponse.create
        );
        const combinedRes = Result.combine(dataFieldRes);
        if (combinedRes.isFailure)
          return Result.fail(
            formatError(combinedRes, UpdateMedicalRecordUseCase.name)
          );
        medicalRecord.changeDataFields(dataFieldRes.map(res => res.val));
      }
      return Result.ok(true);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
