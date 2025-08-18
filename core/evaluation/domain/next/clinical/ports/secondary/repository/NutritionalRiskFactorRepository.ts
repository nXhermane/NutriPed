import { Repository, SystemCode } from "@shared";
import { NutritionalRiskFactor } from "../../../models";

export interface NutritionalRiskFactorRepository
  extends Repository<NutritionalRiskFactor> {
  getByClinicalRefCode(code: SystemCode): Promise<NutritionalRiskFactor[]>;
  getAll(): Promise<NutritionalRiskFactor[]>;
}
