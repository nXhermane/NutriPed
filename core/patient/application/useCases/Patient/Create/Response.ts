import { AggregateID, Either, ExceptionBase, Result } from "@shared";

export type CreatePatientResponse = Either<
  ExceptionBase | unknown,
  Result<{ id: AggregateID }>
>;
