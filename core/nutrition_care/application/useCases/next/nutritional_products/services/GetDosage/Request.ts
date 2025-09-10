import { NUTRITIONAL_PRODUCT_CODE } from "@/core/constants";
import { NextNutritionCare } from "@/core/nutrition_care/domain";

export interface GetNutritionalProductDosageRequest {
  productCode: NUTRITIONAL_PRODUCT_CODE;
  context: NextNutritionCare.NutritionalProductAdvisorContext;
  adjustmentPercentage?: number;
}
