import { DATA_FIELD_CODE_TYPE } from "@/core/constants";
import { Result } from "@/core/shared";
import { DataFieldResponse, DataFieldResponseValue } from "../../../models";

export interface INormalizeDataFieldResponseAcl {
    normalize(dataFields: DataFieldResponse[]): Promise<Result<{ code: DATA_FIELD_CODE_TYPE, value: DataFieldResponseValue }[]>>
}