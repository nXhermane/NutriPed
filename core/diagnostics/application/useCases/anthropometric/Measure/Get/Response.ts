import { Either, ExceptionBase, Result } from "@shared";
import { AnthropometricMeasureDto } from "../../../../dtos";

export type GetAnthropometricMeasureResponse = Either<ExceptionBase | unknown, Result<AnthropometricMeasureDto[]>>;
