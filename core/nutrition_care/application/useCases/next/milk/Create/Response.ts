import { AggregateID, Either, ExceptionBase, Result } from "@/core/shared";

export type CreateMilkResponse = Either<
  ExceptionBase | unknown,
  Result<{ id: AggregateID }>
>;
