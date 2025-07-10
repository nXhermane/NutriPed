import { Either, ExceptionBase, Result } from "@shared";

export type AddDataToMedicalRecordResponse = Either<
  ExceptionBase | unknown,
  Result<void>
>;
