import {
  ApplicationMapper,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { EvaluateNutritionalProductRequest } from "./Request";
import { EvaluateNutritionalProductResponse } from "./Response";
import { NutritionalProductDosageDto } from "@/core/nutrition_care/application/dtos/next/nutritional_products/services";
import { NextNutritionCare } from "@/core/nutrition_care/domain";

export class EvaluateNutritionalProductUseCase
  implements UseCase<EvaluateNutritionalProductRequest, EvaluateNutritionalProductResponse>
{
  constructor(
    private readonly nutritionalProductAdvisorService: NextNutritionCare.NutritionalProductAdvisorService,
    private readonly mapper: ApplicationMapper<NextNutritionCare.NutritionalProductDosage, NutritionalProductDosageDto>
  ) {}
  async execute(
    request: EvaluateNutritionalProductRequest
  ): Promise<EvaluateNutritionalProductResponse> {
    try {
      const evaluationResult = await this.nutritionalProductAdvisorService.evaluate(
        request.context,
        request.adjustmentPercentage
      );

      if (evaluationResult.isFailure) {
        return left(evaluationResult);
      }

      return right(
        Result.ok(this.mapper.toResponse(evaluationResult.val))
      );
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
