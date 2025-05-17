import { Either, ExceptionBase, Result } from "@shared";
import { IndicatorDto } from "../../../../dtos";

export type DeleteIndicatorResponse = Either<ExceptionBase | unknown, Result<IndicatorDto>>;
