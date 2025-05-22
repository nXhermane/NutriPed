import { AggregateID, Either, ExceptionBase, Result } from "@shared";

export type CreateAppetiteTestResponse = Either<
  ExceptionBase | unknown,
  Result<{ id: AggregateID }>
>;
