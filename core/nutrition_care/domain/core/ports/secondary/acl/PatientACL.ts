import { AggregateID, Birthday, Gender } from "@shared";

export interface PatientInfo {
  id: AggregateID;
  birthday: Birthday;
  gender: Gender;
}
export interface NutritionCarePatientACL {
  getPatientInfo(patientID: AggregateID): Promise<PatientInfo | null>;
}
