import { ConditionResult, evaluateCondition, formatError, handleError, Result } from "@/core/shared";
import { EvaluationContext } from "../../../common";
import { ClinicalData } from "../models";
import { ClinicalEvaluationResult, ClinicalSignReferenceRepository, IClinicalEvaluationService } from "../ports";
import { DataFieldResponse, INormalizeDataFieldResponseService } from "../../../data_fields";
import { DATA_FIELD_CODE_TYPE } from "@/core/constants";

export class ClinicalEvaluationService implements IClinicalEvaluationService {
    constructor(private readonly repoRef: ClinicalSignReferenceRepository, private readonly normalizeDataFieldResponse: INormalizeDataFieldResponseService) { }
    async evaluate(data: ClinicalData[], context: EvaluationContext): Promise<Result<ClinicalEvaluationResult[]>> {
        try {
            const clinicalSignEvaluationResults = await Promise.all(data.map(clinicalData => this.evaluateClinicalSign(clinicalData, context)))
            const combinedRes = Result.combine(clinicalSignEvaluationResults)
            if (combinedRes.isFailure) {
                return Result.fail(formatError(combinedRes, ClinicalEvaluationService.name))
            }
            return Result.ok(clinicalSignEvaluationResults.map(res => res.val))
        } catch (e: unknown) {
            return handleError(e)
        }
    }
    private async evaluateClinicalSign(data: ClinicalData, context: EvaluationContext): Promise<Result<ClinicalEvaluationResult>> {
        try {
            const clinicalRef = await this.repoRef.getByCode(data.unpack().code)
            const normalizedClinicalDataVariableRes = await this.normaliseClinicalData(data)
            if (normalizedClinicalDataVariableRes.isFailure) {
                return Result.fail(formatError(normalizedClinicalDataVariableRes, ClinicalEvaluationService.name))
            }
            const evaluationRule = clinicalRef.getRule()
            const composedVariables = { ...normalizedClinicalDataVariableRes.val, ...context }

            const evaluationResult = evaluateCondition(evaluationRule.value, composedVariables)
            if (typeof evaluateCondition == 'string') {
                return Result.fail("Invalide Clinical condition evaluation result.")
            }
            const clinicalSignIsPresent = evaluationResult == ConditionResult.True ? true : false
            return Result.ok({
                code: data.unpack().code,
                isPresent: clinicalSignIsPresent
            })
        } catch (e: unknown) {
            return handleError(e)
        }
    }
    private async normaliseClinicalData(data: ClinicalData): Promise<Result<Record<DATA_FIELD_CODE_TYPE, number | string>>> {
        try {

            const dataFieldResponseResults = Object.entries(data.getData()).map(([code, value]) => DataFieldResponse.create({ code, value }))
            const combinedRes = Result.combine(dataFieldResponseResults)
            if (combinedRes.isFailure) {
                return Result.fail(formatError(combinedRes, ClinicalEvaluationService.name))
            }
            const dataFieldsResponses = dataFieldResponseResults.map(res => res.val)
            return this.normalizeDataFieldResponse.normalize(dataFieldsResponses)
        } catch (e: unknown) {
            return handleError(e)
        }
    }
}