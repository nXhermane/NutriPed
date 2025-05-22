import { AggregateID } from "@shared";

export type DeleteMedicalRecordRequest = {
  patientOrMedicalRecordId: AggregateID;
};
