import { IReminderNotificationService, ReminderNotificationInput, ReminderUpdatedEvent, ReminderUpdatedEventData } from "@/core/reminders";
import { bindEventHandler, DateTime, DomainEventMessage, EventHandler, EventHandlerExecutionFailed } from "@shared";

@DomainEventMessage("On Reminder Updated , Cancel the scheduled notification and make a reschedule.", true)
export class OnReminderUpdatedScheduleNotificationHandler extends EventHandler<ReminderUpdatedEventData, ReminderUpdatedEvent> {
    constructor(private readonly reminderNotificationService: IReminderNotificationService, priority?: number) {
        super(priority)
    }
    async execute(event: ReminderUpdatedEvent): Promise<void> {
        await this.onReminderUpdated(event.data)
    }
    async onReminderUpdated(eventData: ReminderUpdatedEventData): Promise<void> {
        try {
            if (eventData.isActive) {
                await this.reminderNotificationService.cancelNotfication(eventData.id)
                const input: ReminderNotificationInput = {
                    reminderId: eventData.id,
                    title: eventData.title,
                    message: eventData.message,
                    scheduledTime: new DateTime(eventData.scheduledTime).toDate(),
                    hasAction: eventData.actions.length != 0,
                    repeat: eventData.repeat
                }
                await this.reminderNotificationService.scheduleNotification(input)
            }

        } catch (e: unknown) {
            throw new EventHandlerExecutionFailed(`[${OnReminderUpdatedScheduleNotificationHandler.name}]: Error on reminder notification schedule. ${e} `)
        }
    }
}

bindEventHandler(OnReminderUpdatedScheduleNotificationHandler, ReminderUpdatedEvent)