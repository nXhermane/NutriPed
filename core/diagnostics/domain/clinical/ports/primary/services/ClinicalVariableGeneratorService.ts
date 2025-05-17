import { Result } from "@shared";
import { ClinicalNutritionalAnalysisResult } from "../../../models";
export type ClinicalVariableObject = { [key: string]: number };
export interface IClinicalVariableGeneratorService {
   generate(clinicalAnalysis: ClinicalNutritionalAnalysisResult[]): Promise<Result<ClinicalVariableObject>>;
}
