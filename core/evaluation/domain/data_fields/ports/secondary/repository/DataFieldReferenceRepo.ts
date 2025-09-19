import { Repository, SystemCode } from "@/core/shared";
import { DataFieldReference } from "../../../models/entities";

export interface DataFieldReferenceRepository
  extends Repository<DataFieldReference> {
  getByCode(code: SystemCode): Promise<DataFieldReference>;
  getAll(): Promise<DataFieldReference[]>;
}
