import {
  GenerateUniqueId,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@/core/shared";
import { CreateClinicalSignReferenceRequest } from "./Request";
import { CreateClinicalSignReferenceResponse } from "./Response";
import { CreateClinicalSignReference } from "@/core/evaluation/domain/next/clinical";
import { NextClinicalDomain } from "@/core/evaluation/domain";

export class CreateClinicalSignReferenceUseCase
  implements
    UseCase<
      CreateClinicalSignReferenceRequest,
      CreateClinicalSignReferenceResponse
    >
{
  constructor(
    private readonly repo: NextClinicalDomain.ClinicalSignReferenceRepository,
    private readonly idGenerator: GenerateUniqueId
  ) {}
  async execute(
    request: CreateClinicalSignReference
  ): Promise<CreateClinicalSignReferenceResponse> {
    try {
      const newId = this.idGenerator.generate().toValue();
      const clinicalRefResult = NextClinicalDomain.ClinicalSignReference.create(
        request,
        newId
      );
      if (clinicalRefResult.isFailure) {
        return left(clinicalRefResult);
      }
      clinicalRefResult.val.created();
      await this.repo.save(clinicalRefResult.val);
      return right(Result.ok({ id: newId }));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
