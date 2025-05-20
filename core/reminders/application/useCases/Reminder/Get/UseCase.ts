import { ApplicationMapper, handleError, left, Result, right, UseCase } from "@shared";
import { GetReminderRequest } from "./Request";
import { GetReminderResponse } from "./Response";
import { Reminder, ReminderRepository } from "../../../../domain";
import { ReminderDto } from "../../../dtos";

export class GetReminderUseCase implements UseCase<GetReminderRequest, GetReminderResponse> {
    constructor(private readonly repo: ReminderRepository, private readonly mapper: ApplicationMapper<Reminder, ReminderDto>) { }
    async execute(request: GetReminderRequest): Promise<GetReminderResponse> {
        try {
            const reminders = []
            if (request.id) {
                const reminder = await this.repo.getById(request.id)
                reminders.push(reminder)
            }
            else {
                const remindersRes = await this.repo.getAll()
                reminders.push(...remindersRes)
            }
            if (reminders.length === 0) return left(Result.fail("No reminders found"))
            const remindersDto = reminders.map(this.mapper.toResponse)
            return right(Result.ok(remindersDto))
        } catch (e: unknown) {
            return left(handleError(e))
        }
    }
}