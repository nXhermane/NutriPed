import { AggregateID } from "@shared";
import { IDiagnosticCondition } from "../../../domain";

export interface DiagnosticRuleDto {
   id: AggregateID;
   name: string;
   code: string;
   conditions: IDiagnosticCondition[];
   createdAt: string;
   updatedAt: string;
}
