import { Repository, SystemCode } from "@/core/shared";
import { ClinicalSignReference } from "../../../models";

export interface ClinicalSignReferenceRepository extends Repository<ClinicalSignReference> {
    getByCode(code: SystemCode): Promise<ClinicalSignReference>
}