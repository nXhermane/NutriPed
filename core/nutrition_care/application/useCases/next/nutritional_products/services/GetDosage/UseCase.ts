import {
  ApplicationMapper,
  handleError,
  left,
  Result,
  right,
  UseCase,
  SystemCode,
} from "@shared";
import { GetNutritionalProductDosageRequest } from "./Request";
import { GetNutritionalProductDosageResponse } from "./Response";
import { NutritionalProductDosageDto } from "@/core/nutrition_care/application/dtos/next/nutritional_products/services";
import { NextNutritionCare } from "@/core/nutrition_care/domain";

export class GetNutritionalProductDosageUseCase
  implements UseCase<GetNutritionalProductDosageRequest, GetNutritionalProductDosageResponse>
{
  constructor(
    private readonly nutritionalProductAdvisorService: NextNutritionCare.NutritionalProductAdvisorService,
    private readonly mapper: ApplicationMapper<NextNutritionCare.NutritionalProductDosage, NutritionalProductDosageDto>
  ) {}
  async execute(
    request: GetNutritionalProductDosageRequest
  ): Promise<GetNutritionalProductDosageResponse> {
    try {
      const productCodeResult = SystemCode.create(request.productCode);
      if (productCodeResult.isFailure) {
        return left(productCodeResult);
      }

      const dosageResult = await this.nutritionalProductAdvisorService.getDosage(
        productCodeResult.val,
        request.context,
        request.adjustmentPercentage
      );

      if (dosageResult.isFailure) {
        return left(dosageResult);
      }

      return right(
        Result.ok(this.mapper.toResponse(dosageResult.val))
      );
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
