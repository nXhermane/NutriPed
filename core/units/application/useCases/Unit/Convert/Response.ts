import { Either, ExceptionBase, Result } from "@shared";

export type ConvertUnitResponse = Either<
  ExceptionBase | unknown,
  Result<{ value: number; code: string }>
>;
