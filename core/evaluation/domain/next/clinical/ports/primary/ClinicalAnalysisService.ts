import { EvaluationContext } from "./../../../../common";
import { Result } from "@/core/shared";
import { ClinicalData, ClinicalNutritionalAnalysisResult } from "../../models";
export interface IClinicalAnalysisService {
    analyze(data: ClinicalData[], context: EvaluationContext): Promise<Result<ClinicalNutritionalAnalysisResult[]>>
}