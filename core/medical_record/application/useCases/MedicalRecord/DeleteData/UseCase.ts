import { handleError, left, Result, right, UseCase } from "@/core/shared";
import { DeleteDataFromMedicalRecordRequest } from "./Request";
import { DeleteDataFromMedicalRecordResponse } from "./Response";
import { MedicalRecord, MedicalRecordRepository } from "../../../../domain";

export class DeleteDataFromMedicalRecordUseCase
  implements
  UseCase<
    DeleteDataFromMedicalRecordRequest,
    DeleteDataFromMedicalRecordResponse
  > {
  constructor(private readonly repo: MedicalRecordRepository) { }
  async execute(
    request: DeleteDataFromMedicalRecordRequest
  ): Promise<DeleteDataFromMedicalRecordResponse> {
    try {
      const medicalRecord = await this.repo.getByPatientIdOrID(
        request.medicalRecordId
      );
      const delRes = this.deleteDataFromMedicalRecord(
        medicalRecord,
        request.data
      );
      if (delRes.isFailure) return left(delRes);
      await this.repo.save(medicalRecord);
      return right(Result.ok(void 0));
    } catch (e) {
      return left(handleError(e));
    }
  }

  private deleteDataFromMedicalRecord(
    medicalRecord: MedicalRecord,
    data: DeleteDataFromMedicalRecordRequest["data"]
  ): Result<boolean> {
    try {
      if (data.anthropometricData) {
        data.anthropometricData.forEach(id =>
          medicalRecord.deleteAnthropometricRecord(id)
        );
      }
      if (data.clinicalData) {
        data.clinicalData.forEach(id =>
          medicalRecord.deleteClinicalSignRecord(id)
        );
      }
      if (data.biologicalData) {
        data.biologicalData.forEach(id =>
          medicalRecord.deleteBiologicalRecord(id)
        );
      }
      if (data.complicationData) {
        data.complicationData.forEach(id =>
          medicalRecord.deleteComplicationRecord(id)
        );
      }
      if (data.appetiteTests) {
        data.appetiteTests.forEach(id => medicalRecord.deleteAppetiteTestRecord(id))
      }
      if (data.dataFields) {
        data.dataFields.forEach(id => medicalRecord.deleteDataFieldResponse(id))
      }
      return Result.ok(true);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
