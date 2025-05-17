import { AggregateID, AppServiceResponse, Message } from "@shared";
import { CreateDiagnosticRuleRequest, GetDiagnosticRuleRequest } from "../../useCases";
import { DiagnosticRuleDto } from "../../dtos";

export interface IDiagnosticRuleService {
   create(req: CreateDiagnosticRuleRequest): Promise<AppServiceResponse<{ id: AggregateID }> | Message>;
   get(req: GetDiagnosticRuleRequest): Promise<AppServiceResponse<DiagnosticRuleDto[]> | Message>;
}
