import { handleError, left, Result, right, UseCase } from "@shared";
import { DeleteReminderRequest } from "./Request";
import { DeleteReminderResponse } from "./Response";
import { ReminderRepository } from "./../../../../domain";

export class DeleteReminderUseCase implements UseCase<DeleteReminderRequest, DeleteReminderResponse> {
    constructor(private readonly repo: ReminderRepository) { }
    async execute(request: DeleteReminderRequest): Promise<DeleteReminderResponse> {
        try {
            const reminder = await this.repo.getById(request.id)
            reminder.delete()
            await this.repo.remove(reminder)
            return right(Result.ok(void 0))
        } catch (e: unknown) {
            return left(handleError(e))
        }
    }
}