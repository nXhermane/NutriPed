import { Repository, SystemCode } from "@/core/shared";
import { OrientationReference } from "../../../models";

export interface OrientationReferenceRepository
  extends Repository<OrientationReference> {
  getAll(): Promise<OrientationReference[]>;
  getByCode(code: SystemCode): Promise<OrientationReference>;
  exist(code: SystemCode): Promise<boolean>;
}
