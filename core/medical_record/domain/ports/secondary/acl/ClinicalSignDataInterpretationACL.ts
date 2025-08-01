import { AggregateID, Result } from "@/core/shared";

export interface IClinicalSignDataInterpretationACL {
    analyze(patientId: AggregateID, clinicalSignData: { code: string, data: object }[]): Promise<Result<{ code: string; isPresent: boolean; }[]>>
}