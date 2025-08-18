import { formatError, handleError, left, Result, right, UseCase } from "@/core/shared";
import { ValidateDataFieldResponseRequest } from "./Request";
import { ValidateDataFieldResponseResponse } from "./Response";
import { CreateDataFieldResponse, DataFieldResponse, IDataFieldValidatationService } from "../../../../domain";

export class ValidateDataFieldResponseUseCase implements UseCase<ValidateDataFieldResponseRequest, ValidateDataFieldResponseResponse> {
    constructor(private readonly validationService: IDataFieldValidatationService) { }

    async execute(request: ValidateDataFieldResponseRequest): Promise<ValidateDataFieldResponseResponse> {
        try {
            const dataFieldResponsesResult = this.createDataFieldResponses(request.data)
            if (dataFieldResponsesResult.isFailure) {
                return left(dataFieldResponsesResult)
            }
            const validationServiceResult = await this.validationService.validate(dataFieldResponsesResult.val)
            if (validationServiceResult.isFailure) {
                return left(validationServiceResult)
            }
            return right(Result.ok(true))
        } catch (e: unknown) {
            return left(handleError(e))
        }
    }
    private createDataFieldResponses(data: CreateDataFieldResponse[]): Result<DataFieldResponse[]> {
        try {
            const dataFieldResponseResults = data.map(fieldResProps => DataFieldResponse.create(fieldResProps))
            const combinedRes = Result.combine(dataFieldResponseResults)
            if (combinedRes.isFailure) {
                return Result.fail(formatError(combinedRes, ValidateDataFieldResponseUseCase.name))
            }
            return Result.ok(dataFieldResponseResults.map(res => res.val))
        } catch (e: unknown) {
            return handleError(e)
        }
    }
}