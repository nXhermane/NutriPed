import { Sex } from "@shared";

export interface ValidateResult {
  isValid: boolean;
  info?: {
    field: "Anthropometric" | "Clinical" | "Biochemical";
    fieldName: string;
    indication: string;
    error: string;
  };
}
type ContextType = { [key: string]: number | string };
export interface EvaluationContext extends ContextType {
  age_in_month: number;
  age_in_year: number;
  age_in_day: number;
  sex: Sex;
}
