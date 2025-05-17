import { AggregateID, Either, ExceptionBase, Result } from "@shared";

export type CreateMilkResponse = Either<ExceptionBase | unknown, Result<{ id: AggregateID }>>;
