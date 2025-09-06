import { AggregateID, Either, ExceptionBase, Result } from "@/core/shared";

export type CreateNutritionalProductResponse = Either<
  ExceptionBase | unknown,
  Result<{ id: AggregateID }>
>;
