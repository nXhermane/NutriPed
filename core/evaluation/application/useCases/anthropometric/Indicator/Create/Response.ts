import { AggregateID, Either, ExceptionBase, Result } from "@shared";

export type CreateIndicatorResponse = Either<
  ExceptionBase | unknown,
  Result<{ id: AggregateID }>
>;
