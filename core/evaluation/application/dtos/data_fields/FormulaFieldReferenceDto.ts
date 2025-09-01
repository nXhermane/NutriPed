import { AggregateID, IFormula } from "@/core/shared";

export interface FormulaFieldReferenceDto {
  id: AggregateID;
  code: string;
  formula: {
    formula: IFormula;
    description: string;
    variablesExplanation: Record<string, string>;
  };
  createdAt: string;
  updatedAt: string;
}
