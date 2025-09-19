import { Either, ExceptionBase, Result } from "@shared";

export type DeleteMedicalRecordResponse = Either<
  ExceptionBase | unknown,
  Result<void>
>;
