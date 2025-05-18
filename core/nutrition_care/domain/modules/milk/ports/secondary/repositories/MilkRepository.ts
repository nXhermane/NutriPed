import { Repository, SystemCode } from "@shared";
import { Milk, MilkType } from "../../../models";

export interface MilkRepository extends Repository<Milk> {
   getByType(type: MilkType): Promise<Milk>;
   getAll(): Promise<Milk[]>;
}
