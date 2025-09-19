import {
  ApplicationMapper,
  formatError,
  handleError,
  left,
  Result,
  right,
  SystemCode,
  UseCase,
} from "@shared";
import { GetDiagnosticRuleRequest } from "./Request";
import { GetDiagnosticRuleResponse } from "./Response";
import {
  DiagnosticRule,
  DiagnosticRuleRepository,
} from "@/core/evaluation/domain";
import { DiagnosticRuleDto } from "@/core/evaluation/application/dtos";

export class GetDiagnosticRuleUseCase
  implements UseCase<GetDiagnosticRuleRequest, GetDiagnosticRuleResponse>
{
  constructor(
    private readonly repo: DiagnosticRuleRepository,
    private readonly mapper: ApplicationMapper<
      DiagnosticRule,
      DiagnosticRuleDto
    >
  ) {}
  async execute(
    request: GetDiagnosticRuleRequest
  ): Promise<GetDiagnosticRuleResponse> {
    try {
      const diagnosticRules: DiagnosticRule[] = [];
      if (request.id && !request.code) {
        const diagnosticRule = await this.repo.getById(request.id);
        diagnosticRules.push(diagnosticRule);
      } else if (request.code && !request.id) {
        const codeRes = SystemCode.create(request.code);
        if (codeRes.isFailure)
          return left(
            Result.fail(formatError(codeRes, GetDiagnosticRuleUseCase.name))
          );
        const diagnosticRule = await this.repo.getByCode(codeRes.val);
        diagnosticRules.push(diagnosticRule);
      } else {
        const allRules = await this.repo.getAll();
        diagnosticRules.push(...allRules);
      }
      if (diagnosticRules.length === 0) {
        return left(Result.fail("Diagnostic Rules not found"));
      }

      return right(Result.ok(diagnosticRules.map(this.mapper.toResponse)));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
