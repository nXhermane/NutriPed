import { Key } from "lucide-react-native";
import SmartCal, {
  isValidExpression,
  ConditionResult,
  DataType,
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
export const isValidFormula = isValidExpression;
export const evaluateFormula = evaluateCondition;
export { ConditionResult };
