import { is } from "drizzle-orm";
import * as Notifications from "expo-notifications";
export const NOTIFICATION_CONFIG = {
  CHANNEL: {
    REMINDER_CHANNEL: {
      id: "reminder-channel",
      importance: Notifications.AndroidImportance.HIGH,
      name: "Reminder Channel",
      sound: "default",
      vibrationPattern: [0, 250, 250, 250],
    },
  },
  CATEGORIES: {
    REMINDER_ACTIONS: {
      id: "reminder-actions",
      actions: [
        {
          identifier: "snooze",
          buttonTitle: "Snooze",
          options: {
            opensAppToForeground: false,
            isDestructive: true,
            isAuthenticationRequired: true,
          },
        },
        {
          identifier: "done",
          buttonTitle: "Done",
          options: {
            opensAppToForeground: true,
            isDestructive: false,
            isAuthenticationRequired: false,
          },
          textInput: {
            placeholder: "Entreer du text",
            submitButtonTitle: "Btn",
          },
        },
      ],
    },
    NO_ACTION: { id: "no-action", actions: [] },
  },
};
