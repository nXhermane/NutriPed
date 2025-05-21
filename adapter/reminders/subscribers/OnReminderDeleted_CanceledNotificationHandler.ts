import { IReminderNotificationService, ReminderDeletedEvent, ReminderDeletedEventData } from "@/core/reminders";
import { bindEventHandler, DomainEventMessage, EventHandler, EventHandlerExecutionFailed } from "@shared";

@DomainEventMessage("On Reminder Deleted , Cancel the reminder notification", true)
export class OnReminderDeletedCanceledNotificationHandler extends EventHandler<ReminderDeletedEventData, ReminderDeletedEvent> {
    constructor(private readonly reminderNotificationService: IReminderNotificationService, priority?: number) {
        super(priority)
    }
    async execute(event: ReminderDeletedEvent): Promise<void> {
        await this.onReminderDeleted(event.data)
    }
    async onReminderDeleted(eventData: ReminderDeletedEventData): Promise<void> {
        try {
            if (eventData.isActive) {
                await this.reminderNotificationService.cancelNotfication(eventData.id)
            }
        } catch (e: unknown) {
            throw new EventHandlerExecutionFailed(`[${OnReminderDeletedCanceledNotificationHandler.name}]: Error on reminder notification canceling. ${e} `)
        }
    }

}

bindEventHandler(OnReminderDeletedCanceledNotificationHandler, ReminderDeletedEvent)