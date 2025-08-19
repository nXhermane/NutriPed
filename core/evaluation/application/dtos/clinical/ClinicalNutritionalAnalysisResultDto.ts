import { NutrientImpactDto } from "./NutrientImpactDto";
import { RecommendedTestDto } from "../next/clinical/RecommendedTestDto";

export interface ClinicalNutritionalAnalysisResultDto {
  clinicalSign: string;
  suspectedNutrients: NutrientImpactDto[];
  recommendedTests: RecommendedTestDto[];
}
