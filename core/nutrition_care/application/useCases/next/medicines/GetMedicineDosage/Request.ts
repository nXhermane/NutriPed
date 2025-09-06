import { MEDICINE_CODES } from "@/core/constants";
import { NextNutritionCare } from "@/core/nutrition_care/domain";

export type GetMedicineDosageRequest =  {
  code: MEDICINE_CODES;
  context: NextNutritionCare.MedicationDosageContext;
}
