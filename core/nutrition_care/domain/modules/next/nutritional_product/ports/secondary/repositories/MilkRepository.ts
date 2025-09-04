import { Repository, SystemCode } from "@/core/shared";
import { Milk } from "../../../models";
import { MilkType } from "@/core/nutrition_care/domain/modules/milk";

export interface MilkRepository extends Repository<Milk> {
  getAll(): Promise<Milk[]>;
  getByCode(code: SystemCode<MilkType>): Promise<Milk>;
  exist(code: SystemCode<MilkType>): Promise<boolean>;
}
