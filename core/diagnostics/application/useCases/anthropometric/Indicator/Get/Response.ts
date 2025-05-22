import { Either, ExceptionBase, Result } from "@shared";
import { IndicatorDto } from "../../../../dtos";

export type GetIndicatorResponse = Either<
  ExceptionBase | unknown,
  Result<IndicatorDto[]>
>;
