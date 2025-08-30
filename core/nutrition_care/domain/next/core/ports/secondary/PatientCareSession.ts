import { AggregateID, Repository } from "@/core/shared";
import { PatientCareSession } from "../../models";

export interface PatientCareSessionRepository
  extends Repository<PatientCareSession> {
  getByIdOrPatientId(patientIdOrId: AggregateID): Promise<PatientCareSession>;
}
