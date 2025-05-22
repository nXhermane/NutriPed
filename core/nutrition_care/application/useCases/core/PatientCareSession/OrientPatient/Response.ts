import { Either, ExceptionBase, Result } from "@shared";

export type OrientPatientResponse = Either<
  ExceptionBase | unknown,
  Result<{ name: string; code: string }>
>;
