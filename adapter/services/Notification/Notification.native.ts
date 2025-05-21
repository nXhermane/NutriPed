import { IReminderNotificationService, ReminderNotificationInput } from "@/core/reminders";
import { AggregateID } from "@/core/shared";
import * as Notifications from "expo-notifications"


export default class NativeNotification implements IReminderNotificationService {
    constructor() { }
    scheduleNotification(notification: ReminderNotificationInput): Promise<void> {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: notification.title,
                body: notification.message,
                badge: 1,
                data: {
                    reminderId: notification.reminderId,
                }
            },
            trigger: {
                type: 
            }
            })
    }
    cancelNotfication(reminderId: AggregateID): Promise<void> {
        throw new Error("Method not implemented.");
    }

}