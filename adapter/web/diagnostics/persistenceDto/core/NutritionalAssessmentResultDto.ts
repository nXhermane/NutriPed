import { BiochemicalRangeStatus, GrowthIndicatorRange, GrowthStandard, StandardShape } from "@core/constants";
import { EntityPersistenceDto } from "../../../common";

export interface NutritionalAssessmentResultPersistenceDto extends EntityPersistenceDto {
   globalDiagnostics: { code: string; criteriaUsed: string[] }[];
   growthIndicatorValues: {
      code: string;
      unit: string;
      growthStandard: `${GrowthStandard}`;
      referenceSource: `${StandardShape}`;
      valueRange: `${GrowthIndicatorRange}`;
      interpretation: string;
      value: number;
   }[];
   clinicalAnalysis: {
      clinicalSign: string;
      suspectedNutrients: { nutrient: string; effect: "deficiency" | "excess" }[];
      recommendedTests: {
         testName: string;
         reason: string;
      }[];
   }[];
   biologicalInterpretation: {
      code: string;
      interpretation: string[];
      status?: `${BiochemicalRangeStatus}`;
   }[];
}
