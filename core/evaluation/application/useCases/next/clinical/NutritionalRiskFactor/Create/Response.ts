import { AggregateID, Either, ExceptionBase, Result } from "@/core/shared";

export type CreateNutritionalRiskFactorResponse = Either<ExceptionBase | unknown, Result<{ id: AggregateID }>>