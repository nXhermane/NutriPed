import { Either, ExceptionBase, Result } from "@shared";

export type UpdateMedicalRecordResponse = Either<
  ExceptionBase | unknown,
  Result<void>
>;
