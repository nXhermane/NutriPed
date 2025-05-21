import { IReminderNotificationService, ReminderCreatedEvent, ReminderCreatedEventData, ReminderNotificationInput } from "@/core/reminders";
import { bindEventHandler, DomainEventMessage, EventHandler, EventHandlerExecutionFailed } from "@shared";


@DomainEventMessage("Schedule notification after reminder created.", true)
export class OnReminderCreatedScheduleNotificationHandler extends EventHandler<ReminderCreatedEventData, ReminderCreatedEvent> {
    constructor(private readonly reminderNotificationService: IReminderNotificationService, priority?: number) {
        super(priority)
    }
    async execute(event: ReminderCreatedEvent): Promise<void> {
        await this.onReminderCreated(event.data)
    }
    async onReminderCreated(eventData: ReminderCreatedEventData): Promise<void> {
        try {
            if (eventData.isActive) {
                const input: ReminderNotificationInput = {
                    reminderId: eventData.id,
                    title: eventData.title,
                    message: eventData.message,
                    trigger: eventData.trigger,
                    hasAction: eventData.actions.length != 0,
                }
                await this.reminderNotificationService.scheduleNotification(input)
            }
        } catch (e: unknown) {
            throw new EventHandlerExecutionFailed(`[${OnReminderCreatedScheduleNotificationHandler.name}]: Error on reminder notification schedule. ${e} `)
        }

    }

}

bindEventHandler(OnReminderCreatedScheduleNotificationHandler, ReminderCreatedEvent)