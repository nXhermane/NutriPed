import { AggregateID } from "@/core/shared";
import { SerializedReminderTrigger } from "../../../models";

export interface IReminderNotificationService {
  scheduleNotification(notification: ReminderNotificationInput): Promise<void>;
  cancelNotfication(reminderId: AggregateID): Promise<void>;
}

export interface ReminderNotificationInput {
  reminderId: AggregateID;
  title: string;
  message: string;
  trigger: SerializedReminderTrigger;
  hasAction: boolean;
}
