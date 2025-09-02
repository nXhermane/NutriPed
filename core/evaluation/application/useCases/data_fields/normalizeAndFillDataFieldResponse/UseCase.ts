import { formatError, handleError, left, Result, right, UseCase } from "@/core/shared";
import { NormalizeAndFillDefaultDataFieldResponseRequest } from "./Request";
import { NormalizeAndFillDefaultDataFieldResponseResponse } from "./Response";
import { CreateDataFieldResponse, DataFieldResponse, INormalizeDataFieldResponseService } from "@/core/evaluation/domain";

export class NormalizeAndFillDefaultDataFieldResponseUseCase implements UseCase<NormalizeAndFillDefaultDataFieldResponseRequest, NormalizeAndFillDefaultDataFieldResponseResponse> {
    constructor(private readonly normalizeDataFieldService: INormalizeDataFieldResponseService) { }
    async execute(request: NormalizeAndFillDefaultDataFieldResponseRequest): Promise<NormalizeAndFillDefaultDataFieldResponseResponse> {
        try {
            const fieldResponsesRes = this.createAllDataFieldResponses(request.data);
            if (fieldResponsesRes.isFailure) {
                return left(fieldResponsesRes);
            }
            const normalizationResults = await this.normalizeDataFieldService.normalizeAndFillDefaults(fieldResponsesRes.val);
            if (normalizationResults.isFailure) {
                return left(normalizationResults)
            }
            return right(Result.ok(normalizationResults.val))
        } catch (e: unknown) {
            return left(handleError(e));
        }
    }

    private createAllDataFieldResponses(dataFieldResponseProps: CreateDataFieldResponse[]): Result<DataFieldResponse[]> {
        try {
            const fieldResutls = dataFieldResponseProps.map(field => DataFieldResponse.create(field));
            const combinedRes = Result.combine(fieldResutls)
            if (combinedRes.isFailure) {
                return Result.fail(formatError(combinedRes, NormalizeAndFillDefaultDataFieldResponseUseCase.name));
            }
            return Result.ok(fieldResutls.map(res => res.val));
        } catch (e: unknown) {
            return handleError(e);
        }
    }

}