import { CreateAnthropometricData } from "@/core/diagnostics/domain";
import { Either, ExceptionBase, Result } from "@/core/shared";

export type NormalizeAnthropometricDataResponse = Either<
  ExceptionBase | unknown,
  Result<CreateAnthropometricData["anthropometricMeasures"]>
>;
