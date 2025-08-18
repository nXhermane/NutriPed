import { DataFieldCategory, FieldDataType } from "@/core/constants"
import { AggregateID } from "@/core/shared"

export interface DataFieldReferencePersistenceDto {
    id: AggregateID
    code: string
    label: string
    question: string
    category: `${DataFieldCategory}`
    type: `${FieldDataType}`
    range?: [number, number]
    enum?: { label: string, value: string }[]
    units?: { default: string, available: string[] }
    defaultValue: any
    createdAt: string
    updatedAt: string
}