import { Repository, SystemCode } from "@/core/shared";
import { FormulaFieldReference } from "../../../models";

export interface FormulaFieldRefrenceRepo
  extends Repository<FormulaFieldReference> {
  getByCode(code: SystemCode): Promise<FormulaFieldReference>;
}
