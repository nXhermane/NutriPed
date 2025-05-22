import { Result } from "@shared";
import { EvaluationContext } from "../../../../common";
import {
  ClinicalData,
  ClinicalNutritionalAnalysisResult,
} from "../../../models";
export interface IClinicalAnalysisService {
  analyze(
    data: ClinicalData,
    context: EvaluationContext
  ): Promise<Result<ClinicalNutritionalAnalysisResult[]>>;
}
