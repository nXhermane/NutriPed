import { Patient, PatientRepository } from "@core/patient";
import { EntityBaseRepositoryExpo } from "../../../shared";
import { PatientPersistenceDto } from "../dtos";
import { patients } from "./db";
import { AggregateID } from "@shared";

export class PatientRepositoryExpoImpl
  extends EntityBaseRepositoryExpo<
    Patient,
    PatientPersistenceDto,
    typeof patients
  >
  implements PatientRepository
{
  async exist(id: AggregateID): Promise<boolean> {
    return this._exist(id);
  }
}
