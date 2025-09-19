import { AggregateID, Either, ExceptionBase, Result } from "@shared";

export type CreateUnitResponse = Either<
  ExceptionBase | unknown,
  Result<{ id: AggregateID }>
>;
