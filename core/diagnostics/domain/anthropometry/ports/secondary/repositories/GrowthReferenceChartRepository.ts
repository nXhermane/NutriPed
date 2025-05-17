import { Repository, SystemCode } from "@shared";
import { GrowthReferenceChart } from "../../../models";

export interface GrowthReferenceChartRepository extends Repository<GrowthReferenceChart> {
   getByCode(code: SystemCode): Promise<GrowthReferenceChart>;
   getAll(): Promise<GrowthReferenceChart[]>;
   getAllCode(): Promise<SystemCode[]>;
   exist(code: SystemCode): Promise<boolean>
}
