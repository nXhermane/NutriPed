import { DiagnosticRuleDto } from "@core/diagnostics/application/dtos";
import { Either, ExceptionBase, Result } from "@shared";

export type GetDiagnosticRuleResponse = Either<ExceptionBase | unknown, Result<DiagnosticRuleDto[]>>;
