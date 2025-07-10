import { Either, ExceptionBase, Result } from "@shared";
import { MilkDto } from "../../../dtos";

export type GetMilkResponse = Either<
  ExceptionBase | unknown,
  Result<MilkDto[]>
>;
