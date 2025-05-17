import { Either, ExceptionBase, Result } from "@shared";

export type DeleteUnitResponse = Either<ExceptionBase | unknown, Result<void>>;
