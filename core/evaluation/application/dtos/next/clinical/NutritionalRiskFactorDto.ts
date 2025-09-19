import { AggregateID, ICondition } from "@shared";
import { NutrientImpactDto } from "./NutrientImpactDto";
import { RecommendedTestDto } from "./RecommendedTestDto";

export interface NutritionalRiskFactorDto {
  id: AggregateID;
  clinicalSignCode: string;
  associatedNutrients: NutrientImpactDto[];
  modulatingCondition: ICondition;
  recommendedTests: RecommendedTestDto[];
  createdAt: string;
  updatedAt: string;
}
