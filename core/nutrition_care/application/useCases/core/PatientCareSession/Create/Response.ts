import { AggregateID, Either, ExceptionBase, Result } from "@shared";

export type CreatePatientCareSessionResponse = Either<
  ExceptionBase | unknown,
  Result<{ id: AggregateID }>
>;
