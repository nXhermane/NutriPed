import { DomainDateTime, Result, SystemCode } from "@/core/shared";

export enum ConsecutiveVariableType {
    ANTHROP = 'anthropometic',
    CLINICAL = 'clinical',
    BIOLOGICAL = 'biological',
    DATA_FIELD = 'data_fields',
}
export type MedicalRecordVariables = Record<string, number>;
export interface MedicalRecordVariableTransformerAcl {
    getVariableByDate(date: DomainDateTime): Promise<Result<MedicalRecordVariables>>;
    getConsecutiveVariable<T extends string>(code: SystemCode<T>, type: ConsecutiveVariableType, counter: number): Promise<Result<Record<`${T}_${number}`, number>>>
}