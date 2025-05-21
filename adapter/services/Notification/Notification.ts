import { IReminderNotificationService, ReminderNotificationInput } from "@/core/reminders";
import { AggregateID } from "@shared";

export default class ReminderNotificationService implements IReminderNotificationService {
    scheduleNotification(notification: ReminderNotificationInput): Promise<void> {
        throw new Error("Method not implemented.");
    }
    cancelNotfication(reminderId: AggregateID): Promise<void> {
        throw new Error("Method not implemented.");
    }
}