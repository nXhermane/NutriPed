import { Repository, SystemCode } from "@/core/shared";
import { FormulaFieldReference } from "../../../models";

export interface FormulaFieldReferenceRepository
  extends Repository<FormulaFieldReference> {
  getByCode(code: SystemCode): Promise<FormulaFieldReference>;
  getAll(): Promise<FormulaFieldReference[]>;
}
