import { Either, ExceptionBase, Result } from "@shared";

export type UpdateReminderResponse = Either<ExceptionBase | unknown, Result<void>>