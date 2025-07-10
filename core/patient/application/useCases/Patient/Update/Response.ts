import { Either, ExceptionBase, Result } from "@shared";

export type UpdatePatientResponse = Either<
  ExceptionBase | unknown,
  Result<void>
>;
