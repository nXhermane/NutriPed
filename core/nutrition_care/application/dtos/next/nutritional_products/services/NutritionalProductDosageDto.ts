import { NUTRITIONAL_PRODUCT_CODE, DosageFormulaUnit } from "@/core/constants";

export interface NutritionalProductDosageDto {
  calculatedQuantity: {
    minValue: number;
    maxValue: number | null;
    unit: DosageFormulaUnit;
  };
  feedingFrequencies: string[];
  productType: NUTRITIONAL_PRODUCT_CODE;
  recommendedQuantity: {
    values: Record<string, number>;
    unit: DosageFormulaUnit;
  };
}
