import { AggregateID, Either, ExceptionBase, Result } from "@shared";

export type CreateReminderResponse = Either<
  ExceptionBase | unknown,
  Result<{ id: AggregateID }>
>;
