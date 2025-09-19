import notifee, {
  TimestampTrigger,
  IntervalTrigger,
  RepeatFrequency,
  AndroidImportance,
  AndroidVisibility,
  TriggerType,
  TimeUnit,
  AndroidAction,
} from '@notifee/react-native';
import {
  IReminderNotificationService,
  RECURRING_FREQUENCY,
  ReminderNotificationInput,
  ReminderTriggerType,
  SerializedReminderTrigger,
} from "@/core/reminders";
import { AggregateID } from "@shared";
import { NOTIFICATION_CONFIG } from "@/adapter/config/notification/config";

export default class NativeReminderNotificationService
  implements IReminderNotificationService
{
  private readonly CHANNEL_ID = NOTIFICATION_CONFIG.CHANNEL.REMINDER_CHANNEL.id;
  private channelCreated = false;

  constructor() {
    // Initialize will be called when needed
  }

  private async ensureChannelCreated() {
    if (!this.channelCreated) {
      try {
        await notifee.createChannel(NOTIFICATION_CONFIG.CHANNEL.REMINDER_CHANNEL);
        this.channelCreated = true;
      } catch (error) {
        // Channel might already exist, ignore error
        this.channelCreated = true;
      }
    }
  }

  async scheduleNotification(
    notification: ReminderNotificationInput
  ): Promise<void> {
    console.log('🔄 Scheduling notification:', {
      reminderId: notification.reminderId,
      title: notification.title,
      trigger: notification.trigger,
      hasAction: notification.hasAction
    });

    await this.ensureChannelCreated();

    const trigger = this.mapTrigger(notification.trigger);
    console.log('🎯 Mapped trigger:', trigger);

    // Cancel existing notification for this reminderId if it exists
    await this.cancelNotfication(notification.reminderId);

    const actions = notification.hasAction ? this.createActions() : undefined;
    console.log('📱 Actions created:', actions);

    const notificationPayload = {
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
        actions,
        smallIcon: 'ic_launcher', // Use default launcher icon
        largeIcon: 'ic_launcher', // Use default launcher icon
      },
      data: {
        reminderId: String(notification.reminderId),
      },
    };

    console.log('📬 Creating trigger notification with payload:', notificationPayload);

    await notifee.createTriggerNotification(notificationPayload, trigger);

    console.log('✅ Notification scheduled successfully');
  }

  async cancelNotfication(reminderId: AggregateID): Promise<void> {
    await notifee.cancelTriggerNotification(String(reminderId));
  }

  private createActions(): AndroidAction[] {
    return [
      {
        title: 'Snooze',
        pressAction: {
          id: 'snooze',
        },
        input: {
          placeholder: 'Snooze for... (minutes)',
          allowFreeFormInput: false,
          choices: ['5', '10', '15', '30'],
        },
      },
      {
        title: 'Done',
        pressAction: {
          id: 'done',
        },
      },
    ];
  }

  private mapTrigger(trigger: SerializedReminderTrigger): TimestampTrigger | IntervalTrigger {
    switch (trigger.type) {
      case ReminderTriggerType.INTERVAL:
        return {
          type: TriggerType.INTERVAL,
          interval: trigger.every,
          timeUnit: TimeUnit.SECONDS,
        };

      case ReminderTriggerType.DATE_TIME:
        return {
          type: TriggerType.TIMESTAMP,
          timestamp: new Date(trigger.scheduled).getTime(),
        };

      case ReminderTriggerType.RECURRING:
        if (trigger.frequency === RECURRING_FREQUENCY.DAILY) {
          const [hour, minute] = trigger.time.split(':').map(Number);
          // Calculate next occurrence
          const now = new Date();
          const nextOccurrence = new Date(now);
          nextOccurrence.setHours(hour, minute, 0, 0);

          // If the time has already passed today, schedule for tomorrow
          if (nextOccurrence <= now) {
            nextOccurrence.setDate(nextOccurrence.getDate() + 1);
          }

          return {
            type: TriggerType.TIMESTAMP,
            timestamp: nextOccurrence.getTime(),
            repeatFrequency: RepeatFrequency.DAILY,
          };
        }

        if (trigger.frequency === RECURRING_FREQUENCY.WEEKLY && trigger.daysOfWeek) {
          const [hour, minute] = trigger.time.split(':').map(Number);
          const now = new Date();
          const nextOccurrence = new Date(now);
          nextOccurrence.setHours(hour, minute, 0, 0);

          // Find the next day of the week
          const currentDay = now.getDay();
          const targetDays = trigger.daysOfWeek.sort((a, b) => a - b);

          for (const targetDay of targetDays) {
            let daysToAdd = targetDay - currentDay;
            if (daysToAdd <= 0) {
              daysToAdd += 7; // Next week
            }

            const candidateDate = new Date(now);
            candidateDate.setDate(now.getDate() + daysToAdd);
            candidateDate.setHours(hour, minute, 0, 0);

            if (candidateDate > now) {
              nextOccurrence.setTime(candidateDate.getTime());
              break;
            }
          }

          return {
            type: TriggerType.TIMESTAMP,
            timestamp: nextOccurrence.getTime(),
            repeatFrequency: RepeatFrequency.WEEKLY,
          };
        }

        throw new Error("Invalid RECURRING trigger format");

      default:
        throw new Error("Unsupported ReminderTrigger type");
    }
  }
}
