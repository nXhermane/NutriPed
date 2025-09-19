import { AggregateID, Either, ExceptionBase, Result } from "@shared";

export type CreateComplicationResponse = Either<
  ExceptionBase | unknown,
  Result<{ id: AggregateID }>
>;
