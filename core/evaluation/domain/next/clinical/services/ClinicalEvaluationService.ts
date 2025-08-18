import { handleError, Result } from "@/core/shared";
import { EvaluationContext, UnitAcl } from "../../../common";
import { ClinicalData } from "../models";
import { ClinicalEvaluationResult, ClinicalSignReferenceRepository, IClinicalEvaluationService } from "../ports";

export class ClinicalEvaluationService implements IClinicalEvaluationService {
    constructor(private readonly repoRef: ClinicalSignReferenceRepository, private readonly unitAcl: UnitAcl) { }
    evaluate(data: ClinicalData[], context: EvaluationContext): Promise<Result<ClinicalEvaluationResult[]>> {
     
    }
    private async evaluateClinicalSign(data: ClinicalData, context: EvaluationContext): Promise<Result<ClinicalEvaluationResult>> {
        try {
          const clinicalRef = await this.repoRef.getByCode(data.unpack().code)
          const evaluatonRule = clinicalRef.getRule()
        } catch (e: unknown) {
            return handleError(e)
        }
    }

}
/**
 * Normaliser les données en entrer avec un service developper dans le context de data_fields 
 */