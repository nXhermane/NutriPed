import { Key, RussianRuble } from "lucide-react-native";
import SmartCal, {
  isValidExpression,
  ConditionResult,
  DataType,
  FormulaVariableNotFoundError,
  InvalidFormulaError,
  IncorrectSyntaxError,
  FormulaInterpreterError,
} from "smartcal";
import { Result } from "../core";

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
export function catchEvaluationError(callback: () => void = () => { }) {
  try {
    callback()
  } catch (e: unknown) {
    if (e instanceof FormulaVariableNotFoundError) {
      return {
        message: e.message,
        variables: e.getData()
      }
    } else if (e instanceof InvalidFormulaError || e instanceof IncorrectSyntaxError) {
      return {
        message: e.message,
        data: e.getData()
      }
    } else {
      return {
        message: `Unexpected Error : ${(e as any)?.message}`
      }
    }
  }
}
export const isValidFormula = isValidExpression;
export const evaluateFormula = evaluateCondition;
export { ConditionResult };
