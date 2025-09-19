import { ValidationRule } from "./ValidationRule";

export interface AnthropometricMeasure {
  name: string;
  code: string;
  validationRules: ValidationRule[];
  availableUnit: string[];
  unit: string;
  description?: string;
}
