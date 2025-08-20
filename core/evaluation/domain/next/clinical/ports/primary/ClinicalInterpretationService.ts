import { Result } from "@/core/shared";
import { ClinicalEvaluationResult } from "./ClinicalEvaluationService";
import { ClinicalNutritionalAnalysisResult } from "../../models";
import { EvaluationContext } from "./../../../../common";

export interface IClinicalInterpretationService {
  interpret(
    clinicalSigns: ClinicalEvaluationResult[],
    context: EvaluationContext
  ): Promise<Result<ClinicalNutritionalAnalysisResult[]>>;
}
