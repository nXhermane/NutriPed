import { Either, ExceptionBase, Result } from "@shared";
import { AppetiteTestRefDto } from "../../../dtos";

export type GetAppetiteTestResponse = Either<
  ExceptionBase | unknown,
  Result<AppetiteTestRefDto>
>;
