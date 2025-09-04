import SmartCal, {
  isValidExpression,
  ConditionResult,
  DataType,
  FormulaVariableNotFoundError,
  InvalidFormulaError,
  IncorrectSyntaxError,
} from "smartcal";

export const isValidCondition = isValidExpression;
export const evaluateCondition = <T extends DataType>(
  condition: string,
  obj?: T
) => {
  if (obj) {
    const mappedObj = Object.fromEntries(
      Object.entries(obj).map(([key, val]) => [
        key,
        typeof val === "boolean"
          ? val
            ? ConditionResult.True
            : ConditionResult.False
          : val,
      ])
    );
    return SmartCal(condition, mappedObj);
  } else {
    return SmartCal(condition);
  }
};
export function catchEvaluationError(
  callback: () => number | string = () => {
    return 0;
  }
) {
  try {
    return {
      result: callback(),
    };
  } catch (e: unknown) {
    if (e instanceof FormulaVariableNotFoundError) {
      return {
        message: e.message,
        variables: e.getData(),
      };
    } else if (
      e instanceof InvalidFormulaError ||
      e instanceof IncorrectSyntaxError
    ) {
      return {
        message: `[Message]: ${e.message}\n [Data]:${e.getData()}`,
      };
    } else {
      return {
        message: `Unexpected Error : ${(e as any)?.message}`,
      };
    }
  }
}
export function getResultFormCatchEvaluationResult(
  evaluationResult: ReturnType<typeof catchEvaluationError>,
  variablesExplanation: Record<string, string>
) {
  if ("result" in evaluationResult) {
    return evaluationResult.result;
  } else if ("variables" in evaluationResult) {
    throw new Error(
      `The variable missing error. La variable ${evaluationResult.variables?.variableName} (${variablesExplanation[evaluationResult.variables?.variableName as string]}) n'est pas disponible. [Error]:${evaluationResult.message}.`
    );
  } else {
    throw new Error(evaluationResult.message);
  }
}

export const isValidFormula = isValidExpression;
export const evaluateFormula = evaluateCondition;
export { ConditionResult };
