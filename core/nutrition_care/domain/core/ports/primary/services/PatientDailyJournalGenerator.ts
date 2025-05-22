import { Result } from "@shared";
import { PatientCareSession } from "../../../models";

export interface IPatientDailyJournalGenerator {
  createDailyJournalIfNeeded(
    patientCareSession: PatientCareSession
  ): Result<void>;
}
