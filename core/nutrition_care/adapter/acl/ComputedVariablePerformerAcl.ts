import {
  SystemCode,
  Result,
  handleError,
  formatError,
  IFormula,
  catchEvaluationError,
  evaluateFormula,
  getResultFormCatchEvaluationResult,
} from "@/core/shared";
import { IComputedVariablePerformerACL } from "../../domain/next/core";
import {
  FormulaFieldReferenceDto,
  IFormulaFieldReferenceService,
} from "@/core/evaluation";

export class ComputedVariablePerformerAcl
  implements IComputedVariablePerformerACL
{
  constructor(
    private readonly formulaFieldService: IFormulaFieldReferenceService
  ) {}
  async computeVariables(
    computedVariableCodes: SystemCode<string>[],
    context: Record<string, number>
  ): Promise<Result<Record<string, number>>> {
    try {
      const computationResults = await Promise.all(
        computedVariableCodes.map(code => this.computeVariable(code, context))
      );
      const combinedRes = Result.combine(computationResults);
      if (combinedRes.isFailure) {
        return Result.fail(
          formatError(combinedRes, ComputedVariablePerformerAcl.name)
        );
      }
      const variables = computationResults.reduce<Record<string, number>>(
        (acc, currentRes) => {
          return { ...acc, ...currentRes.val };
        },
        {}
      );
      return Result.ok(variables);
    } catch (e) {
      return handleError(e);
    }
  }
  private async computeVariable(
    variableCode: SystemCode<string>,
    context: Record<string, number>
  ): Promise<Result<Record<string, number>>> {
    try {
      const formulaFieldRes = await this.getFormulaField(variableCode);
      if (formulaFieldRes.isFailure) {
        return Result.fail(
          formatError(formulaFieldRes, ComputedVariablePerformerAcl.name)
        );
      }
      const formula = formulaFieldRes.val.formula;
      const evaluationResult = this.evaluateFormula(
        formula.formula,
        formula.variablesExplanation,
        context
      );
      if (evaluationResult.isFailure) {
        return Result.fail(
          formatError(evaluationResult, ComputedVariablePerformerAcl.name)
        );
      }
      return Result.ok({ [variableCode.unpack()]: evaluationResult.val });
    } catch (e: unknown) {
      return handleError(e);
    }
  }
  private evaluateFormula(
    formula: IFormula,
    variablesExplanation: Record<string, string>,
    context: Record<string, number>
  ): Result<number> {
    try {
      const evaluationResult = catchEvaluationError(() =>
        evaluateFormula(formula.value, context)
      );
      const formulaEvaluationResult = getResultFormCatchEvaluationResult(
        evaluationResult,
        variablesExplanation
      );
      if (formulaEvaluationResult === undefined) {
        return Result.fail("The formula evaluation failed without reason.");
      }
      return Result.ok(formulaEvaluationResult as number);
    } catch (e) {
      return handleError(e);
    }
  }
  private async getFormulaField(
    code: SystemCode<string>
  ): Promise<Result<FormulaFieldReferenceDto>> {
    try {
      const fieldResponse = await this.formulaFieldService.get({
        code: code.unpack(),
      });
      if ("content" in fieldResponse) {
        return Result.fail(JSON.parse(fieldResponse.content));
      }
      return Result.ok(fieldResponse.data[0]);
    } catch (e) {
      return handleError(e);
    }
  }
}
