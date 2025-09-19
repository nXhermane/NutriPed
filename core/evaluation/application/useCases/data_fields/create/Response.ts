import { AggregateID, Either, ExceptionBase, Result } from "@/core/shared";

export type CreateDataFieldRefResponse = Either<
  ExceptionBase | unknown,
  Result<{ id: AggregateID }>
>;
