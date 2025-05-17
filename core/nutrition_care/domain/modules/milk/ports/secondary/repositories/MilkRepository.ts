import { Repository, SystemCode } from "@shared";
import { Milk } from "../../../models";

export interface MilkRepository extends Repository<Milk> {
   getByCode(code: SystemCode): Promise<Milk>;
   getAll(): Promise<Milk[]>;
}
