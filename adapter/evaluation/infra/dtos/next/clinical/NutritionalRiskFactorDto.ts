import { NutrientImpactDto, RecommendedTestDto } from "@/core/evaluation";
import { AggregateID, ICondition } from "@/core/shared";

export interface NutritionalRiskFactorPersistenceDto {
  id: AggregateID;
  clinicalSignCode: string;
  associatedNutrients: NutrientImpactDto[];
  modulatingCondition: ICondition;
  recommendedTests: RecommendedTestDto[];
  createdAt: string;
  updatedAt: string;
}
