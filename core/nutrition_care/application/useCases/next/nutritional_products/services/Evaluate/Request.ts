import { NextNutritionCare } from "@/core/nutrition_care/domain";

export interface EvaluateNutritionalProductRequest {
  context: NextNutritionCare.NutritionalProductAdvisorContext;
  adjustmentPercentage?: number;
}
