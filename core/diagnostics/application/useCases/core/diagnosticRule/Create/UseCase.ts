import {
  formatError,
  GenerateUniqueId,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { CreateDiagnosticRuleRequest } from "./Request";
import { CreateDiagnosticRuleResponse } from "./Response";
import {
  DiagnosticRule,
  DiagnosticRuleRepository,
} from "@core/diagnostics/domain";

export class CreateDiagnosticRuleUseCase
  implements UseCase<CreateDiagnosticRuleRequest, CreateDiagnosticRuleResponse>
{
  constructor(
    private readonly idGenerator: GenerateUniqueId,
    private readonly diagnosticRuleRepo: DiagnosticRuleRepository
  ) {}
  async execute(
    request: CreateDiagnosticRuleRequest
  ): Promise<CreateDiagnosticRuleResponse> {
    try {
      const newId = this.idGenerator.generate().toValue();
      const diagnosticRuleRes = DiagnosticRule.create(request.data, newId);
      if (diagnosticRuleRes.isFailure)
        return left(
          Result.fail(
            formatError(diagnosticRuleRes, CreateDiagnosticRuleUseCase.name)
          )
        );
      const exist = await this.diagnosticRuleRepo.exist(
        diagnosticRuleRes.val.getProps().code
      );
      if (exist)
        return left(
          Result.fail(
            `The diagnostic rule  with this code [${diagnosticRuleRes.val.getCode()}] already exist.`
          )
        );

      diagnosticRuleRes.val.created();
      await this.diagnosticRuleRepo.save(diagnosticRuleRes.val);
      return right(Result.ok({ id: newId }));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
