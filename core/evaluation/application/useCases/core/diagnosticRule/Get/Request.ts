import { AggregateID } from "@shared";

export type GetDiagnosticRuleRequest = {
  id?: AggregateID;
  code?: string;
};
