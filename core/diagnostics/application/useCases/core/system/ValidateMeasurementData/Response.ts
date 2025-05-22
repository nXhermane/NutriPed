import { Either, ExceptionBase, Result } from "@shared";

export type ValidateMeasurementsResponse = Either<
  ExceptionBase | unknown,
  Result<boolean>
>;
