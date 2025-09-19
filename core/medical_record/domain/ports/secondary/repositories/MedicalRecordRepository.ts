import { MedicalRecord } from "./../../../models";
import { AggregateID, Repository } from "@shared";

export interface MedicalRecordRepository
  extends Omit<Repository<MedicalRecord>, "getById"> {
  getByPatientIdOrID(patientIdOrId: AggregateID): Promise<MedicalRecord>;
  remove(medicalRecord: MedicalRecord): Promise<void>;
}
