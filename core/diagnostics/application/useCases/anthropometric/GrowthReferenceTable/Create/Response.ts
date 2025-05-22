import { AggregateID, Either, ExceptionBase, Result } from "@shared";

export type CreateGrowthReferenceTableResponse = Either<
  ExceptionBase | unknown,
  Result<{ id: AggregateID }>
>;
