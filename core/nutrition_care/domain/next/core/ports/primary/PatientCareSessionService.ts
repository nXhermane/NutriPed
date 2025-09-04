import { AggregateID, Result } from "@/core/shared";
import { PatientCareSession } from "../../models";
import { CARE_PHASE_CODES } from "@/core/constants";

export interface IPatientCareSessionService {
  generate(
    patientId: AggregateID,
    treatmentCode: CARE_PHASE_CODES
  ): Result<Result<PatientCareSession>>;
  followUp(patientCareSession: PatientCareSession): Promise<void>;
}
