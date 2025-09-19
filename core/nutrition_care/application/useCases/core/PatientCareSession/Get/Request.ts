import { AggregateID } from "@shared";

export type GetPatientCareSessionRequest = {
  patientIdOrSessionId: AggregateID;
};
