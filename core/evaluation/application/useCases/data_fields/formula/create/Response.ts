import { AggregateID, Either, ExceptionBase, Result } from "@/core/shared";

export type CreateFormulaFieldReferenceResponse = Either<
  ExceptionBase | unknown,
  Result<{ id: AggregateID }>
>;
