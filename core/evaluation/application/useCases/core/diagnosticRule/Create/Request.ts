import { DiagnosticRuleDto } from "@/core/evaluation/application/dtos";
import { CreatePropsDto } from "@shared";

export type CreateDiagnosticRuleRequest = CreatePropsDto<DiagnosticRuleDto>;
