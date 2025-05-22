import { Result } from "@shared";
import { EvaluationContext, ValidateResult } from "../../../../common";
import { AnthropometricData } from "../../../models";

export interface IAnthropometricValidationService {
  validate(
    data: AnthropometricData,
    context: EvaluationContext
  ): Promise<Result<ValidateResult>>;
}
