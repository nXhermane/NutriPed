import { Result } from "@shared";
import { EvaluationContext } from "../../../../common";
import { AnthropometricData, GrowthIndicatorValue } from "../../../models";
import { AnthropometricVariableObject } from "../../../common";

export interface IAnthropometricVariableGeneratorService {
   generate(
      data: AnthropometricData,
      context: EvaluationContext,
      growthIndicatorValues?: GrowthIndicatorValue[],
   ): Promise<Result<AnthropometricVariableObject>>;
}
