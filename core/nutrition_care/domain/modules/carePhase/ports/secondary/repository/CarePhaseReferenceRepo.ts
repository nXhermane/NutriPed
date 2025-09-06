import { Repository, SystemCode } from "@/core/shared";
import { CarePhaseReference } from "../../../models";

export interface CarePhaseReferenceRepository
  extends Repository<CarePhaseReference> {
  getByCode(code: SystemCode): Promise<CarePhaseReference>;
  getAll(): Promise<CarePhaseReference[]>;
  exist(code: SystemCode): Promise<boolean>;
}
