import { NUTRITIONAL_PRODUCT_CODE } from "@/core/constants";
import { CreateConditionalDosageFormula, IDosageByWeight } from "@/core/nutrition_care/domain/modules/next";
import { AggregateID, CreateCriterion, ICondition, IFormula } from "@/core/shared";

export interface DosageScenarioDto {
  applicability: CreateCriterion;
  conditionalDosageFormulas: CreateConditionalDosageFormula[];
  dosages:IDosageByWeight[]
  isAdmissionWeight: boolean;
}

export interface NutritionalProductDto {
  id: AggregateID;
  code: NUTRITIONAL_PRODUCT_CODE;
  dosageTables: DosageScenarioDto[];
  createdAt: string;
  updatedAt: string;
}
