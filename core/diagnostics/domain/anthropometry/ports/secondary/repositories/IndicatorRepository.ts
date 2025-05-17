import { Repository, SystemCode } from "@shared";
import { Indicator } from "../../../models";


export interface IndicatorRepository extends Repository<Indicator> {
   getAll(): Promise<Indicator[]>;
   getByCode(code: SystemCode): Promise<Indicator>;
   getAllCode(): Promise<SystemCode[]>;
    exist(code: SystemCode): Promise<boolean>
}
