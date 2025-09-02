import { DATA_FIELD_CODE_TYPE } from "@/core/constants";
import { handleError, Result } from "@/core/shared";
import { DataFieldResponse, DataFieldResponseValue, INormalizeDataFieldResponseAcl } from "../../domain";
import { INormalizeDataAppService } from "@/core/evaluation";

export class NormalizeDataFieldResponseACl implements INormalizeDataFieldResponseAcl {
    constructor(
        private readonly normalizeDataService: INormalizeDataAppService
    ) { }
    async normalize(dataFields: DataFieldResponse[]): Promise<Result<{ code: DATA_FIELD_CODE_TYPE; value: DataFieldResponseValue; }[]>> {
        try {
            const request = dataFields.map(field => ({
                code: field.getCode(),
                value: field.getData()
            }))
            const normalizationResult = await this.normalizeDataService.normalizeAndFillDefault({
                data: request
            })
            if ('data' in normalizationResult) {
                const normalizedFields = normalizationResult.data;
                return Result.ok(Object.entries(normalizationResult).map((fieldEntries) => ({
                    code: fieldEntries[0] as DATA_FIELD_CODE_TYPE, value: fieldEntries[1] as number | string
                })))
            }
            const _errorContent = JSON.parse(normalizationResult.content)
            return Result.fail(_errorContent);
        } catch (e: unknown) {
            return handleError(e);
        }
    }

}