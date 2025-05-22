import { AggregateID, Either, ExceptionBase, Result } from "@shared";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CreateAnthropometricMeasureResponse = Either<
  ExceptionBase | any,
  Result<{ id: AggregateID }>
>;
