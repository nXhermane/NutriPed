import { Repository, SystemCode } from "@shared";
import { AnthropometricMeasure } from "./../../../models";

export interface AnthropometricMeasureRepository
  extends Repository<AnthropometricMeasure> {
  getByCode(code: SystemCode): Promise<AnthropometricMeasure>;
  getAll(): Promise<AnthropometricMeasure[]>;
  getAllCode(): Promise<SystemCode[]>;
  exist(code: SystemCode): Promise<boolean>;
}
