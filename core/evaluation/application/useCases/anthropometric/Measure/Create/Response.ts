import { AggregateID, Either, ExceptionBase, Result } from "@shared";

export type CreateAnthropometricMeasureResponse = Either<
  ExceptionBase | any,
  Result<{ id: AggregateID }>
>;
