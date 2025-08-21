import {
  ConditionResult,
  evaluateCondition,
  handleError,
  Result,
} from "@shared";
import { AnthropometricVariableObject } from "../common";
import {
  Indicator,
  IndicatorInterpreter,
  ZScoreVarName,
} from "../models";
import { IZScoreInterpretationService } from "./interfaces/ZScoreInterpretationService";
import { GROWTH_INDICATOR_ERRORS, handleGrowthIndicatorError } from "../errors";

export class ZScoreInterpretationService
  implements IZScoreInterpretationService
{
  constructor() {}
  async findInterpretation(
    data: AnthropometricVariableObject,
    zScore: number,
    indicator: Indicator
  ): Promise<Result<IndicatorInterpreter>> {
    try {
      const interpretations = indicator.getProps().interpretations;
      const interpretation = interpretations.find(interp => {
        const { condition } = interp.unpack();
        const conditionEvaluationContext = data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (conditionEvaluationContext as any)[ZScoreVarName] = zScore;
        const conditionResult = evaluateCondition(
          condition.unpack().value,
          conditionEvaluationContext
        );
        return conditionResult === ConditionResult.True;
      });

      if (!interpretation) {
        return handleGrowthIndicatorError(
          GROWTH_INDICATOR_ERRORS.INTERPRETATION.NOT_FOUND.path,
          `zScore : ${zScore} indicator: ${indicator.getCode()}`
        );
      }

      return Result.ok(interpretation);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
