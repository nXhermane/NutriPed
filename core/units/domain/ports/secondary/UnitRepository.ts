import { Repository, SystemCode } from "@shared";
import { Unit, UnitType } from "../../models";

export interface UnitRepository extends Repository<Unit> {
   getByCode(code: SystemCode): Promise<Unit>;
   getAll(type?: UnitType): Promise<Unit[]>;
   remove(unit: Unit): Promise<void>;
   exist(code: SystemCode): Promise<boolean>;
}
