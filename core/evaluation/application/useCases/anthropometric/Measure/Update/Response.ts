import { Either, ExceptionBase, Result } from "@shared";
import { AnthropometricMeasureDto } from "../../../../dtos";

export type UpdateAnthropometricMeasureResponse = Either<
  ExceptionBase | unknown,
  Result<AnthropometricMeasureDto>
>;
