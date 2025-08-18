import { NutritionalRiskFactor } from "../../domain";
import { ApplicationMapper } from "@shared";
import { NutritionalRiskFactorDto } from "../dtos";

export class NutritionalRiskFactorMapper
  implements ApplicationMapper<NutritionalRiskFactor, NutritionalRiskFactorDto>
{
  toResponse(entity: NutritionalRiskFactor): NutritionalRiskFactorDto {
    return {
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      clinicalSignCode: entity.getClinicalSignCode(),
      associatedNutrients: entity.getAssociatedNutrients().map(nutrient => ({
        effect: nutrient.effect,
        nutrient: nutrient.nutrient.unpack(),
      })),
      modulatingCondition: entity.getModulatingCondition(),
      recommendedTests: entity.getRecommendedTests(),
    };
  }
}
