import { AggregateID } from "@/core/shared";

export type GetLatestValuesUntilDateRequest = {
    patientOrMedicalRecordId: AggregateID;
    datetime?: string;
}