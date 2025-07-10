import { AggregateID, Either, ExceptionBase, Result } from "@shared";

export type CreateNutritionalRiskFactorResponse = Either<
  ExceptionBase | unknown,
  Result<{ id: AggregateID }>
>;
