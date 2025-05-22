import { Either, ExceptionBase, Result } from "@shared";
import { ComplicationDto } from "../../../dtos";

export type GetComplicationResponse = Either<
  ExceptionBase | unknown,
  Result<ComplicationDto[]>
>;
