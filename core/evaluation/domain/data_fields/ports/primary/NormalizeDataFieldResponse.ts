import { Result } from "@/core/shared";
import { DataFieldResponse } from "../../models";
import { DATA_FIELD_CODE_TYPE } from "@/core/constants";

export interface INormalizeDataFieldResponseService {
    normalize(dataFieldResponse: DataFieldResponse[]): Promise<Result<Record<DATA_FIELD_CODE_TYPE, number | string>>>
}