import { AggregateID } from "@shared";
import { ValidationRuleDto } from "./ValidationRuleDto";

export interface AnthropometricMeasureDto {
  id: AggregateID;
  name: string;
  code: string;
  validationRules: ValidationRuleDto[];
  availableUnit: string[];
  unit: string;
  createdAt: string;
  updatedAt: string;
}
