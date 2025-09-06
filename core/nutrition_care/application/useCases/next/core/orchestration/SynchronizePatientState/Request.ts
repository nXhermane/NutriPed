import { AggregateID } from "@shared";

export type SynchronizePatientStateRequest = {
  sessionId: AggregateID;
  patientVariables?: Record<string, number>;
};
