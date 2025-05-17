import { ICondition } from "@shared";


export interface DiagnosticRule {
  name: string;
  code: string;
  conditions: ICondition[];
}
