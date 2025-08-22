import { Repository, SystemCode } from "@/core/shared";
import { CarephaseReference } from "../../../models";

export interface CarePhaseReferenceRepository extends Repository<CarephaseReference> {
    getByCode(code: SystemCode): Promise<CarephaseReference>;
    getAll(): Promise<CarephaseReference[]>;
}