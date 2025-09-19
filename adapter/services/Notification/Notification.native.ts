import notifee, {
  TimestampTrigger,
  IntervalTrigger,
  RepeatFrequency,
  AndroidImportance,
  AndroidVisibility,
  TriggerType,
  TimeUnit,
} from '@notifee/react-native';
import {
  IReminderNotificationService,
  RECURRING_FREQUENCY,
  ReminderNotificationInput,
  ReminderTriggerType,
  SerializedReminderTrigger,
} from "@/core/reminders";
import { AggregateID } from "@shared";

export default class NativeReminderNotificationService
  implements IReminderNotificationService
{
  private readonly CHANNEL_ID = 'reminder-channel';

  constructor() {
    this.initialize();
  }

  private async initialize() {
    // Create the notification channel
    await notifee.createChannel({
      id: this.CHANNEL_ID,
      name: 'Reminder Channel',
      importance: AndroidImportance.HIGH,
      sound: 'default',
      vibration: true,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  async scheduleNotification(
    notification: ReminderNotificationInput
  ): Promise<void> {
    const trigger = this.mapTrigger(notification.trigger);

    // Cancel existing notification for this reminderId if it exists
    await this.cancelNotfication(notification.reminderId);

    const notificationId = await notifee.createTriggerNotification(
      {
        id: String(notification.reminderId),
        title: notification.title,
        body: notification.message,
        android: {
          channelId: this.CHANNEL_ID,
          importance: AndroidImportance.HIGH,
          visibility: AndroidVisibility.PUBLIC,
          pressAction: {
            id: 'default',
          },
          actions: notification.hasAction ? [
            {
              title: 'Snooze',
              pressAction: {
                id: 'snooze',
              },
            },
            {
              title: 'Done',
              pressAction: {
                id: 'done',
              },
            },
          ] : undefined,
        },
        data: {
          reminderId: notification.reminderId,
        },
      },
      trigger
    );
  }

  async cancelNotfication(reminderId: AggregateID): Promise<void> {
    await notifee.cancelTriggerNotification(String(reminderId));
  }

  private mapTrigger(trigger: SerializedReminderTrigger): any {
    switch (trigger.type) {
      case ReminderTriggerType.INTERVAL:
        return {
          type: 1, // IntervalTrigger
          interval: trigger.every * 1000, // Convert seconds to milliseconds
          timeUnit: 1, // TimeUnit.MILLISECONDS equivalent
        };

      case ReminderTriggerType.DATE_TIME:
        return {
          type: 0, // TimestampTrigger
          timestamp: new Date(trigger.scheduled).getTime(),
        };

      case ReminderTriggerType.RECURRING:
        if (trigger.frequency === RECURRING_FREQUENCY.DAILY) {
          const [hour, minute] = trigger.time.split(':').map(Number);
          return {
            type: 2, // RepeatFrequencyTrigger
            repeatFrequency: RepeatFrequency.DAILY,
            hour,
            minute,
          };
        }

        if (trigger.frequency === RECURRING_FREQUENCY.WEEKLY && trigger.daysOfWeek) {
          const [hour, minute] = trigger.time.split(':').map(Number);
          return {
            type: 2, // RepeatFrequencyTrigger
            repeatFrequency: RepeatFrequency.WEEKLY,
            hour,
            minute,
            daysOfWeek: trigger.daysOfWeek,
          };
        }

        throw new Error("Invalid RECURRING trigger format");

      default:
        throw new Error("Unsupported ReminderTrigger type");
    }
  }
}
