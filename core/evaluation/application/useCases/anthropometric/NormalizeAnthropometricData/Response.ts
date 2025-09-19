import { CreateAnthropometricData } from "@/core/evaluation/domain";
import { Either, ExceptionBase, Result } from "@/core/shared";

export type NormalizeAnthropometricDataResponse = Either<
  ExceptionBase | unknown,
  Result<CreateAnthropometricData["anthropometricMeasures"]>
>;
