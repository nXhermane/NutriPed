import { EvaluationContext } from "./../../../../common";
import { ClinicalData } from "../../models";
import { Result, SystemCode } from "@/core/shared";
export interface ClinicalEvaluationResult {
  code: SystemCode;
  isPresent: boolean;
}
export interface IClinicalEvaluationService {
  evaluate(
    data: ClinicalData[],
    context: EvaluationContext
  ): Promise<Result<ClinicalEvaluationResult[]>>;
}
