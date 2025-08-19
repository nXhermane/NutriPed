import { Result } from "@/core/shared";
import { ClinicalEvaluationResult } from "./ClinicalEvaluationService";

export type ClinicalVariableObject = Record<string , number | string>
export interface IClinicalVariableGeneratorService {
    generate(clinicalEvaluationResults: ClinicalEvaluationResult[] ): Promise<Result<Record<string , string | number>>> 
}