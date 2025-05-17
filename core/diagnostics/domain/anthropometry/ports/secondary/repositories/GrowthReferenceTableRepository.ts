import { Repository, SystemCode } from "@shared";
import { GrowthReferenceTable } from "../../../models";

export interface GrowthReferenceTableRepository extends Repository<GrowthReferenceTable> {
   getByCode(code: SystemCode): Promise<GrowthReferenceTable>;
   getAll(): Promise<GrowthReferenceTable[]>;
   getAllCode(): Promise<SystemCode[]>;
    exist(code: SystemCode): Promise<boolean>
}
