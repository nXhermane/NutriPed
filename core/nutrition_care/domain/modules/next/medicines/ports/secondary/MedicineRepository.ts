import { Repository, SystemCode } from "@/core/shared";
import { Medicine } from "../../models";
import { MEDICINE_CODES } from "@/core/constants";

export interface MedicineRepository extends Repository<Medicine> {
  getByCode(code: SystemCode<MEDICINE_CODES>): Promise<Medicine>;
  getAll(): Promise<Medicine[]>;
  exist(code: SystemCode<MEDICINE_CODES>): Promise<boolean>;
}
