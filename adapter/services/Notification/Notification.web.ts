import {
  IReminderNotificationService,
  ReminderNotificationInput,
} from "@/core/reminders";
import { AggregateID } from "@shared";

type TimeoutMap = Map<string, number>;

export default class WebReminderNotificationService
  implements IReminderNotificationService
{
  private scheduledTimeouts: TimeoutMap = new Map();

  async scheduleNotification(
    notification: ReminderNotificationInput
  ): Promise<void> {
    // Vérifier la permission de notification
    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }
    if (Notification.permission !== "granted") {
      throw new Error("Notification permission denied.");
    }
    const trigger = notification.trigger;
    let delayMs = 0;
    if ("scheduled" in trigger) {
      const scheduledDate = new Date(trigger.scheduled);
      delayMs = scheduledDate.getTime() - Date.now();
      if (delayMs < 0) delayMs = 0; // si dans le passé, envoyer tout de suite
    }
    // Planifier notification via setTimeout (page doit rester ouverte)
    const timeoutId = window.setTimeout(() => {
      new Notification(notification.title, {
        body: notification.message,
        data: { reminderId: notification.reminderId },
      });
      this.scheduledTimeouts.delete(notification.reminderId as string);
    }, delayMs);

    this.scheduledTimeouts.set(notification.reminderId as string, timeoutId);
  }

  async cancelNotfication(reminderId: AggregateID): Promise<void> {
    const timeoutId = this.scheduledTimeouts.get(reminderId as string);
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      this.scheduledTimeouts.delete(reminderId as string);
    }
  }
}
