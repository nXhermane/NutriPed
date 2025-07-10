import { AggregateID } from "@shared";

export type MakePatientCareSessionReadyRequest = {
  patientIdOrPatientCareId: AggregateID;
};
