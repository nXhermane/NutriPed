import { Either, ExceptionBase, Result } from "@shared";

export type DeleteReminderResponse = Either<ExceptionBase | unknown, Result<void>>
