import { AggregateID, Either, ExceptionBase, Result } from "@shared";

export type CreateMedicalRecordResponse = Either<
  ExceptionBase | unknown,
  Result<{ id: AggregateID }>
>;
