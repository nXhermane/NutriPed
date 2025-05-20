import { Either, ExceptionBase, Result } from "@shared";
import { ReminderDto } from "../../../dtos";

export type GetReminderResponse = Either<ExceptionBase | unknown, Result<ReminderDto[]>>