import { AndroidImportance } from '@notifee/react-native';

export const NOTIFICATION_CONFIG = {
  CHANNEL: {
    REMINDER_CHANNEL: {
      id: "reminder-channel",
      importance: AndroidImportance.HIGH,
      name: "Reminder Channel",
      sound: "default",
      vibration: true,
    },
  },
  CATEGORIES: {
    REMINDER_ACTIONS: {
      id: "reminder-actions",
      actions: [
        {
          title: "Snooze",
          pressAction: {
            id: "snooze",
          },
        },
        {
          title: "Done",
          pressAction: {
            id: "done",
          },
        },
      ],
    },
    NO_ACTION: { id: "no-action", actions: [] },
  },
};
