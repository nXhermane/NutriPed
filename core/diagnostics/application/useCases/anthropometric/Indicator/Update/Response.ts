import { Either, ExceptionBase, Result } from "@shared";
import { IndicatorDto } from "../../../../dtos";

export type UpdateIndicatorResponse = Either<ExceptionBase | unknown, Result<IndicatorDto>>;
