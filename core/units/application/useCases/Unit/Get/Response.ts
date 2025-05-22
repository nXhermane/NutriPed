import { Either, ExceptionBase, Result } from "@shared";
import { UnitDto } from "../../../dtos";

export type GetUnitResponse = Either<
  ExceptionBase | unknown,
  Result<UnitDto[]>
>;
