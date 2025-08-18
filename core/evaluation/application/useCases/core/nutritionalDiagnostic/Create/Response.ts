import { AggregateID, Either, ExceptionBase, Result } from "@shared";

export type CreateNutritionalDiagnosticResponse = Either<
  ExceptionBase | unknown,
  Result<{ id: AggregateID }>
>;
