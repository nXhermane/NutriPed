import { Repository, SystemCode } from "@shared";
import { ClinicalSignReference } from "../../../models";

export interface ClinicalSignReferenceRepository extends Repository<ClinicalSignReference> {
   getByCode(code: SystemCode): Promise<ClinicalSignReference>;
   getAll(): Promise<ClinicalSignReference[]>;
   getAllCode(): Promise<SystemCode[]>;
   exist(code: SystemCode): Promise<boolean>;
}
