import { CreateFormulaFieldReferenceResponse } from "./Response";
import { CreateFormulaFieldReferenceRequest } from "./Request";
import {
  GenerateUniqueId,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@/core/shared";
import {
  CreateFormulaFieldReference,
  FormulaFieldReference,
  FormulaFieldRefrenceRepo,
} from "@/core/evaluation/domain";
export class CreateFormulaFieldReferenceUseCase
  implements
    UseCase<
      CreateFormulaFieldReferenceRequest,
      CreateFormulaFieldReferenceResponse
    >
{
  constructor(
    private readonly idGenerator: GenerateUniqueId,
    private readonly repo: FormulaFieldRefrenceRepo
  ) {}
  async execute(
    request: CreateFormulaFieldReference
  ): Promise<CreateFormulaFieldReferenceResponse> {
    try {
      const newId = this.idGenerator.generate().toValue();
      const formulaFieldRes = FormulaFieldReference.create(request, newId);
      if (formulaFieldRes.isFailure) {
        return left(formulaFieldRes);
      }
      await this.repo.save(formulaFieldRes.val);
      return right(Result.ok({ id: newId }));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
