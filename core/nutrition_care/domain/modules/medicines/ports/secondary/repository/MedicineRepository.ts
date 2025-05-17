import { Repository, SystemCode } from "@shared";
import { Medicine } from "../../../models";

export interface MedicineRepository extends Repository<Medicine> {
   getByCode(code: SystemCode): Promise<Medicine>;
   getAll(): Promise<Medicine[]>;
   exist(code: SystemCode): Promise<boolean>;
}
