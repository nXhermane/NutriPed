import { Either, ExceptionBase, Result } from "@/core/shared";

export type DeleteDataFromMedicalRecordResponse = Either<
  ExceptionBase | unknown,
  Result<void>
>;
