import { DateTime, formatError, handleError, left, Result, right, UseCase } from "@shared";
import { UpdateReminderRequest } from "./Request";
import { UpdateReminderResponse } from "./Response";
import { Reminder, ReminderAction, ReminderRepository } from "./../../../../domain";

export class UpdateReminderUseCase implements UseCase<UpdateReminderRequest, UpdateReminderResponse> {
    constructor(private readonly repo: ReminderRepository) { }
    async execute(request: UpdateReminderRequest): Promise<UpdateReminderResponse> {
        try {
            const reminder = await this.repo.getById(request.id)
            const updateResult = this.updateReminder(reminder, request.data)
            if (updateResult.isFailure) return left(updateResult)
            reminder.updated()
            await this.repo.save(reminder)
            return right(Result.ok(void 0))
        } catch (e: unknown) {
            return left(handleError(e))
        }
    }

    private updateReminder(reminder: Reminder, data: UpdateReminderRequest["data"]): Result<void> {
        try {
            if (data.title) reminder.updateTitle(data.title)
            if (data.message) reminder.updateMessage(data.message)
            if (data.repeat) reminder.updateRepeat(data.repeat)
            if (data.scheduledTime) {
                const newScheduledTimeRes = DateTime.create(data.scheduledTime)
                if (newScheduledTimeRes.isFailure) return Result.fail(formatError(newScheduledTimeRes, UpdateReminderUseCase.name))
                reminder.reschedule(newScheduledTimeRes.val)
            }
            if (data.isActive != undefined) {
                if (data.isActive) reminder.activate()
                else reminder.deactivate()
            }
            if (data.actions) {
                const actionsResults = data.actions.map(action => ReminderAction.create(action))
                const combinedResult = Result.combine(actionsResults)
                if (combinedResult.isFailure) return Result.fail(formatError(combinedResult, UpdateReminderUseCase.name))
                reminder.changeActions(actionsResults.map(action => action.val))
            }
            return Result.ok(void 0)
        } catch (e: unknown) {
            return handleError(e)
        }
    }
}