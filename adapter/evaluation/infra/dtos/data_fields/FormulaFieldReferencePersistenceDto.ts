import { AggregateID } from "@/core/shared";

export interface FormulaFieldReferencePersistenceDto {
  id: AggregateID;
  code: string;
  formula: {
    formula: string;
    description: string;
    variablesExplanation: Record<string, string>;
  };
  createdAt: string;
  updatedAt: string;
}
