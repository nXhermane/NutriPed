import { ICondition } from "@shared";
import { ClinicalSignData } from "./clinicalSignData";

export interface ClinicalSignReference {
  name: string;
  code: string;
  description: string;
  evaluationRule: ICondition;
  data: ClinicalSignData[];
}
