import { AggregateID } from "@/core/shared"
import { ReminderRepeat } from "../../../models"

export interface IReminderNotificationService {
    scheduleNotification(notification: ReminderNotificationInput): Promise<void>
    cancelNotfication(reminderId: AggregateID): Promise<void>
}

export interface ReminderNotificationInput {
    reminderId: AggregateID
    title: string
    message: string
    scheduledTime: Date
    repeat: ReminderRepeat
    hasAction: boolean
}