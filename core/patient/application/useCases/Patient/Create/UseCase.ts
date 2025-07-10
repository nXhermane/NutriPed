import {
  GenerateUniqueId,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { CreatePatientRequest } from "./Request";
import { CreatePatientResponse } from "./Response";
import { Patient, PatientRepository } from "../../../../domain";

export class CreatePatientUseCase
  implements UseCase<CreatePatientRequest, CreatePatientResponse>
{
  constructor(
    private readonly idGenerator: GenerateUniqueId,
    private readonly repo: PatientRepository
  ) {}
  async execute(request: CreatePatientRequest): Promise<CreatePatientResponse> {
    try {
      const patientId = this.idGenerator.generate().toValue();
      const patientRes = Patient.create(request.data, patientId);
      if (patientRes.isFailure) return left(patientRes);
      patientRes.val.created();
      await this.repo.save(patientRes.val);
      return right(Result.ok({ id: patientId }));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
