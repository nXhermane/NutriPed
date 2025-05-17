import { AggregateID, Repository } from "@shared";
import { Patient } from "../../models";

export interface PatientRepository extends Repository<Patient> {
   getAll(): Promise<Patient[]>;
   exist(id: AggregateID): Promise<boolean>;
   remove(patient: Patient): Promise<void>;
}
