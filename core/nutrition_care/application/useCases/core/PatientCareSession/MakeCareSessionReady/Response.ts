import { Either, ExceptionBase, Result } from "@shared";

export type MakePatientCareSessionReadyResponse = Either<
  ExceptionBase | unknown,
  Result<boolean>
>;
