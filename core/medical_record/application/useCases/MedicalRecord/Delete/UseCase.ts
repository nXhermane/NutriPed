import { handleError, left, Result, right, UseCase } from "@shared";
import { DeleteMedicalRecordRequest } from "./Request";
import { DeleteMedicalRecordResponse } from "./Response";
import { MedicalRecordRepository } from "./../../../../domain";

export class DeleteMedicalRecordUseCase
  implements UseCase<DeleteMedicalRecordRequest, DeleteMedicalRecordResponse>
{
  constructor(private readonly repo: MedicalRecordRepository) {}
  async execute(
    request: DeleteMedicalRecordRequest
  ): Promise<DeleteMedicalRecordResponse> {
    try {
      const medicalRecord = await this.repo.getByPatientIdOrID(
        request.patientOrMedicalRecordId
      );
      medicalRecord.delete();
      await this.repo.remove(medicalRecord);
      return right(Result.ok(void 0));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
