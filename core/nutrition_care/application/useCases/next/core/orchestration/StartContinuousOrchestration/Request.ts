import { AggregateID } from "@shared";

export type StartContinuousOrchestrationRequest = {
  sessionId: AggregateID;
  patientVariables?: Record<string, number>;
  maxIterations?: number;
};
