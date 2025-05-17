import { Repository, SystemCode } from "@shared";
import { BiochemicalReference } from "../../../models";

export interface BiochemicalReferenceRepository extends Repository<BiochemicalReference> {
   getByCode(code: SystemCode): Promise<BiochemicalReference>;
   getAll(): Promise<BiochemicalReference[]>;
   getAllCode(): Promise<SystemCode[]>;
   exist(code: SystemCode): Promise<boolean>;
}
