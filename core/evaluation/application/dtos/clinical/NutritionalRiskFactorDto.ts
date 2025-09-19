import { AggregateID } from "@shared";
import { ICondition } from "../../../domain";
import { NutrientImpactDto } from "./NutrientImpactDto";
import { RecommendedTestDto } from "../next/clinical/RecommendedTestDto";

export interface NutritionalRiskFactorDto {
  id: AggregateID;
  clinicalSignCode: string;
  associatedNutrients: NutrientImpactDto[];
  modulatingCondition: ICondition;
  recommendedTests: RecommendedTestDto[];
  createdAt: string;
  updatedAt: string;
}
