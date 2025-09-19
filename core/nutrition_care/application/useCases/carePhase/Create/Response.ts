import { AggregateID, Either, ExceptionBase, Result } from "@/core/shared";

export type CreateCarePhaseReferenceResponse = Either<
  ExceptionBase | unknown,
  Result<{ id: AggregateID }>
>;
