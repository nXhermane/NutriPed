import {
  GrowthStandard,
  StandardShape,
  GrowthIndicatorRange,
  BiochemicalRangeStatus,
} from "@core/constants";
import { EntityPersistenceDto } from "../../../../shared";

export interface NutritionalAssessmentResultPersistenceDto
  extends EntityPersistenceDto {
  globalDiagnostics: { code: string; criteriaUsed: string[] }[];
  growthIndicatorValues: {
    code: string;
    unit: string;
    growthStandard: `${GrowthStandard}`;
    referenceSource: `${StandardShape}`;
    valueRange: `${GrowthIndicatorRange}`;
    interpretation: string;
    value: number;
    isValid: boolean;
    computedValue: [xAxis: number, yAxis: number]
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
