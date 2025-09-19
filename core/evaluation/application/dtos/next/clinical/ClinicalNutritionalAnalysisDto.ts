import { NextClinicalDomain } from "@/core/evaluation/domain";

export interface ClinicalNutritionalAnalysisDto {
  signCode: string;
  suspectedNutrients: NextClinicalDomain.CreateNutrientImpact[];
  recommendedTests: NextClinicalDomain.IRecommendedTest[];
}
