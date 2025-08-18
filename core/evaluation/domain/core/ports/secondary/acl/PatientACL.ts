import { AggregateID, Birthday, Gender, Result } from "@shared";

export interface PatientInfo {
  id: AggregateID;
  birthday: Birthday;
  gender: Gender;
}
export interface PatientACL {
  getPatientInfo(patientID: AggregateID): Promise<Result<PatientInfo | null>>;
}
