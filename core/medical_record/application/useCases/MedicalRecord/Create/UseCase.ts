import {
  AggregateID,
  GenerateUniqueId,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { CreateMedicalRecordRequest } from "./Request";
import { CreateMedicalRecordResponse } from "./Response";

import {
  PatientACL,
  MedicalRecordRepository,
  MedicalRecord,
} from "./../../../../domain";

export class CreateMedicalRecordUseCase
  implements UseCase<CreateMedicalRecordRequest, CreateMedicalRecordResponse>
{
  constructor(
    private readonly idGenerator: GenerateUniqueId,
    private readonly repo: MedicalRecordRepository,
    private readonly patientAcl: PatientACL
  ) {}
  async execute(
    request: CreateMedicalRecordRequest
  ): Promise<CreateMedicalRecordResponse> {
    try {
      // BETA:
      // const patientValidationResult = await this.checkIfIsValidPatient(request.patientId);
      // if (patientValidationResult.isFailure) return left(patientValidationResult);

      const newId = this.idGenerator.generate().toValue();
      const medicalRecordRes = MedicalRecord.create(
        { patientId: request.patientId },
        newId
      );
      if (medicalRecordRes.isFailure) return left(medicalRecordRes);
      medicalRecordRes.val.created();
      await this.repo.save(medicalRecordRes.val);
      return right(Result.ok({ id: newId }));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
  private async checkIfIsValidPatient(
    patientId: AggregateID
  ): Promise<Result<boolean>> {
    try {
      const patient = await this.patientAcl.getPatientInfo(patientId);
      if (!patient)
        return Result.fail(
          "Patient Not found. Please the medical record must be create for an existing patient"
        );
      return Result.ok(true);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
