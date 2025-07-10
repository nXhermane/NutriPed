import { AggregateID, Either, ExceptionBase, Result } from "@shared";

export type CreateClinicalSignReferenceResponse = Either<
  ExceptionBase | unknown,
  Result<{ id: AggregateID }>
>;
