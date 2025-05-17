import { AggregateID, Repository } from "@shared";
import { PatientCareSession } from "../../../models";

export interface PatientCareSessionRepository extends Omit<Repository<PatientCareSession>, "getById"> {
   getByIdOrPatientId(sessionIdOrPatientId: AggregateID): Promise<PatientCareSession>;
   remove(patientCareSession: PatientCareSession): Promise<void>;
}
