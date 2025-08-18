import { Result } from "@/core/shared";
import { EvaluationContext, UnitAcl } from "../../../common";
import { ClinicalData, ClinicalNutritionalAnalysisResult } from "../models";
import { ClinicalSignReferenceRepository, IClinicalAnalysisService, NutritionalRiskFactorRepository } from "../ports";

export class ClinicalAnalysisService implements IClinicalAnalysisService {
    constructor(
        private readonly signRefRepo: ClinicalSignReferenceRepository,
        private readonly nutritionalRiskRefRepo: NutritionalRiskFactorRepository,
        private readonly unitAcl: UnitAcl
    ) { }

   async  analyze(data: ClinicalData[], context: EvaluationContext): Promise<Result<ClinicalNutritionalAnalysisResult[]>> {
        // 
    }

}