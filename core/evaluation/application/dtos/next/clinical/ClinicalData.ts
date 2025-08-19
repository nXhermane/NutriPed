import { DATA_FIELD_CODE_TYPE } from "@/core/constants"
import { DataFieldResponseValue } from "@/core/evaluation/domain"

export interface ClinicalDataDto {
    code: string
    data: Record<DATA_FIELD_CODE_TYPE, DataFieldResponseValue>
}