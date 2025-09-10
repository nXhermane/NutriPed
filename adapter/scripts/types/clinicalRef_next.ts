import { Next_ClinicalSignData } from "./clinicalSignData_next";
import { ICondition } from "./Indicator";

export interface Next_ClinicalSignReference {
  name: string;
  code: string;
  description: string;
  evaluationRule: ICondition;
  data: Next_ClinicalSignData[];
}
