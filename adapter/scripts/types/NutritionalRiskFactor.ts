import { ICondition } from "@shared";
import { RecommendedTest } from "./RecommendedTest";

export interface NutritionalRiskFactor {
  clinicalSignCode: string;
  associatedNutrients: { nutrient: string; effect: "deficiency" | "excess" }[];
  modulatingCondition: ICondition;
  recommendedTests: RecommendedTest[];
}
