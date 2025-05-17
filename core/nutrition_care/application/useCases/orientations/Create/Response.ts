import { AggregateID, Either, ExceptionBase, Result } from "@shared";

export type CreateOrientationRefResponse = Either<ExceptionBase | unknown, Result<{ id: AggregateID }>>;
