import {
  GenerateUniqueId,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@/core/shared";
import { CreateNutritionalRiskFactorRequest } from "./Request";
import { CreateNutritionalRiskFactorResponse } from "./Response";
import { CreateNutritionalRiskFactorProps } from "@/core/evaluation/domain/next/clinical";
import { NextClinicalDomain } from "@/core/evaluation/domain";

export class CreateNutritionalRiskFactorUseCase
  implements
    UseCase<
      CreateNutritionalRiskFactorRequest,
      CreateNutritionalRiskFactorResponse
    >
{
  constructor(
    private readonly idGenerator: GenerateUniqueId,
    private readonly nutritionalRiskFactor: NextClinicalDomain.NutritionalRiskFactorRepository
  ) {}
  async execute(
    request: CreateNutritionalRiskFactorProps
  ): Promise<CreateNutritionalRiskFactorResponse> {
    try {
      const newId = this.idGenerator.generate().toValue();
      const nutritionalRiskFactorRes =
        NextClinicalDomain.NutritionalRiskFactor.create(request, newId);
      if (nutritionalRiskFactorRes.isFailure) {
        return left(nutritionalRiskFactorRes);
      }
      nutritionalRiskFactorRes.val.created();
      await this.nutritionalRiskFactor.save(nutritionalRiskFactorRes.val);
      return right(Result.ok({ id: newId }));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
