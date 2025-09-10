import { AggregateID, Either, ExceptionBase, Result } from "@/core/shared";

export type CreateRecommendedTreatmentResponse = Either<ExceptionBase | unknown, Result<{ id: AggregateID }>>;