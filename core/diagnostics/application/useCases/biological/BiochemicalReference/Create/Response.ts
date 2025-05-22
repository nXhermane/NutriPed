import { AggregateID, Either, ExceptionBase, Result } from "@shared";

export type CreateBiochemicalReferenceResponse = Either<
  ExceptionBase | unknown,
  Result<{ id: AggregateID }>
>;
