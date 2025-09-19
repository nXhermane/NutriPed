import { AggregateID, Either, ExceptionBase, Result } from "@/core/shared";

export type CreateClinicalSignReferenceResponse = Either<
  ExceptionBase | unknown,
  Result<{ id: AggregateID }>
>;
