import { ApplicationMapper } from "@/core/shared";
import { NutritionalProductDosageDto } from "../../../../dtos/next/nutritional_products/services";
import { NextNutritionCare } from "../../../../../domain";

export class NutritionalProductDosageMapper implements ApplicationMapper<NextNutritionCare.NutritionalProductDosage, NutritionalProductDosageDto> {
  toResponse(entity: NextNutritionCare.NutritionalProductDosage): NutritionalProductDosageDto {
    return {
      calculatedQuantity: {
        minValue: entity.getCalculatedQuantity().minValue,
        maxValue: entity.getCalculatedQuantity().maxValue,
        unit: entity.getCalculatedQuantity().unit,
      },
      feedingFrequencies: entity.getFeedingFrequencies(),
      productType: entity.getProductType(),
      recommendedQuantity: {
        values: entity.getRecommendedQuantity().values,
        unit: entity.getRecommendedQuantity().unit,
      },
    };
  }

  toDomain(dto: NutritionalProductDosageDto): NextNutritionCare.NutritionalProductDosage {
    throw new Error("Mapping DTO to Domain not implemented yet");
  }
}
