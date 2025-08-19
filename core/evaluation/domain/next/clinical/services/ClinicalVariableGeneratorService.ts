import { ConditionResult, handleError, Result } from "@/core/shared";
import { ClinicalEvaluationResult, ClinicalSignReferenceRepository, ClinicalVariableObject, IClinicalVariableGeneratorService } from "../ports";

export class ClinicalVariableGeneratorService implements IClinicalVariableGeneratorService {
    constructor(private readonly clinicalRefRepo: ClinicalSignReferenceRepository) { }
    async generate(clinicalEvaluationResults: ClinicalEvaluationResult[]): Promise<Result<ClinicalVariableObject>> {
        try {
            const clinicalRefsCodes = (await this.clinicalRefRepo.getAllCode()).map(code => code.unpack())
            const clinicalVariableObject: ClinicalVariableObject = {}
            const clinicalEvaluationResultRecord = clinicalEvaluationResults.reduce((acc: any, current) => {
                acc[current.code.unpack()] = current.isPresent ? ConditionResult.True : ConditionResult.False
                return acc
            }, {})
            for (const clinicalRefCode of clinicalRefsCodes) {
                clinicalVariableObject[clinicalRefCode] = clinicalEvaluationResultRecord[clinicalRefCode] == undefined ? ConditionResult.False : clinicalEvaluationResultRecord[clinicalRefCode]
            }

            return Result.ok(clinicalVariableObject)
        } catch (e: unknown) {
            return handleError(e)
        }
    }

}