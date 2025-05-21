import * as Notifications from "expo-notifications"
import { IReminderNotificationService, RECURRING_FREQUENCY, ReminderNotificationInput, ReminderTriggerType, SerializedReminderTrigger } from "@/core/reminders"
import { AggregateID } from "@shared"
import { NOTIFICATION_CONFIG } from "@/adapter/config/notification/config"

export default  class NativeReminderNotificationService implements IReminderNotificationService {
    constructor() { }
    async scheduleNotification(notification: ReminderNotificationInput): Promise<void> {
        const trigger = this.mapTrigger(notification.trigger)
        // if the notification is already scheduled for the same reminderId, cancel it
        // and reschedule it
        await this.cancelNotfication(notification.reminderId)
        await Notifications.scheduleNotificationAsync({
            content: {
                title: notification.title,
                body: notification.message,
                badge: 1,
                categoryIdentifier: notification.hasAction ? NOTIFICATION_CONFIG.CATEGORIES.REMINDER_ACTIONS.id  : NOTIFICATION_CONFIG.CATEGORIES.NO_ACTION.id,
                data: {
                    reminderId: notification.reminderId,
                },

            },
            trigger: {
                ...trigger,
                channelId: NOTIFICATION_CONFIG.CHANNEL.REMINDER_CHANNEL.id,


            }
        })
    }

    async cancelNotfication(reminderId: AggregateID): Promise<void> {
        const notificationIdMap = await this.getScheduledRemiderIdAssociatedWithNotificationId()
        if (notificationIdMap.has(reminderId)) {
            const { notificationId } = notificationIdMap.get(reminderId)!
            await Notifications.cancelScheduledNotificationAsync(notificationId)
        }
    }

    private getAllScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
        return Notifications.getAllScheduledNotificationsAsync()
    }
    private async getScheduledRemiderIdAssociatedWithNotificationId(): Promise<Map<AggregateID, { notificationId: string }>> {
        const scheduledNotifications = await this.getAllScheduledNotifications()
        const reminderIdMap = new Map<AggregateID, { notificationId: string }>()
        for (const notification of scheduledNotifications) {
            const reminderId = notification.content.data?.reminderId
            if (!reminderId) continue
            reminderIdMap.set(reminderId as AggregateID, { notificationId: notification.identifier })
        }
        return reminderIdMap
    }
    private mapTrigger(trigger: SerializedReminderTrigger): Notifications.NotificationTriggerInput {
        switch (trigger.type) {
            case ReminderTriggerType.INTERVAL:
                return {
                    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                    seconds: trigger.every,
                    repeats: true,
                }

            case ReminderTriggerType.DATE_TIME:
                return {
                    type: Notifications.SchedulableTriggerInputTypes.DATE,
                    date: new Date(trigger.scheduled)
                }

            case ReminderTriggerType.RECURRING:
                if (trigger.frequency === RECURRING_FREQUENCY.DAILY) {
                    const [hour, minute] = trigger.time.split(":").map(Number)
                    return {
                        type: Notifications.SchedulableTriggerInputTypes.DAILY,
                        hour,
                        minute,
                    }
                }

                if (trigger.frequency === RECURRING_FREQUENCY.WEEKLY && trigger.daysOfWeek) {
                    const [hour, minute] = trigger.time.split(":").map(Number)
                    return {
                        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
                        // Note: daysOfWeek is 0-indexed in the API, so we need to add 1 to match the expected format
                        weekday: trigger.daysOfWeek[0] + 1,
                        hour,
                        minute,
                    }
                }

                throw new Error("Invalid RECURRING trigger format")

            default:
                throw new Error("Unsupported ReminderTrigger type")
        }
    }
}
