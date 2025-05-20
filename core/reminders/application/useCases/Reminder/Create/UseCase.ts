import { GenerateUniqueId, handleError, left, Result, right, UseCase } from "@shared";
import { CreateReminderRequest } from "./Request";
import { CreateReminderResponse } from "./Response";
import { CreateReminderProps, Reminder, ReminderRepository } from "../../../../domain";

export class CreateReminderUseCase implements UseCase<CreateReminderRequest, CreateReminderResponse> {
    constructor(private readonly idGenerator: GenerateUniqueId, private readonly repo: ReminderRepository) { }
    async execute(request: CreateReminderProps): Promise<CreateReminderResponse> {
        try {
            const newId = this.idGenerator.generate()
            const reminderRes = Reminder.create(request, newId.toValue())
            if (reminderRes.isFailure) return left(reminderRes)
            const reminder = reminderRes.val
            reminder.created()
            await this.repo.save(reminder)
            return right(Result.ok({ id: newId.toValue() }))
        } catch (e: unknown) {
            return left(handleError(e))
        }
    }
}