import { NutrientImpactDto } from "./NutrientImpactDto";
import { RecommendedTestDto } from "./RecommendedTestDto";

export interface ClinicalNutritionalAnalysisResultDto {
   clinicalSign: string;
   suspectedNutrients: NutrientImpactDto[];
   recommendedTests: RecommendedTestDto[];
}
