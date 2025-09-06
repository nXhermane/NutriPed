import { AggregateID } from "@shared";
import { CARE_PHASE_CODES } from "@/core/constants";

export type CreatePatientCareSessionRequest = {
  patientId: AggregateID;
  phaseCode: CARE_PHASE_CODES;
  patientVariables?: Record<string, number>;
};
