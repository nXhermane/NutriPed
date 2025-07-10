import { Either, ExceptionBase, Result } from "@shared";

export type UpdateUnitResponse = Either<ExceptionBase | unknown, Result<void>>;
