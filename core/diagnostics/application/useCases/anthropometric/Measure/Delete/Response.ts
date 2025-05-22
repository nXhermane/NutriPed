import { Either, ExceptionBase, Result } from "@shared";
import { AnthropometricMeasureDto } from "../../../../dtos";

export type DeleteAnthropometricMeasureResponse = Either<
  ExceptionBase | unknown,
  Result<AnthropometricMeasureDto>
>;
