import { DiagnosticRuleDto } from "@core/diagnostics/application/dtos";
import { CreatePropsDto } from "@shared";

export type CreateDiagnosticRuleRequest = CreatePropsDto<DiagnosticRuleDto>;
