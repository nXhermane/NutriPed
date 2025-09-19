import { AggregateID, Either, ExceptionBase, Result } from "@shared";

export type CreateOrientationReferenceResponse = Either<
  ExceptionBase | unknown,
  Result<{ id: AggregateID }>
>;
