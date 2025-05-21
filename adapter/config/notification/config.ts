import { is } from 'drizzle-orm';
import * as Notifications from 'expo-notifications';
export const NOTIFICATION_CONFIG = {
    CHANNEL: {
        REMINDER_CHANNEL: {
            id: "reminder-channel",
            importance: Notifications.AndroidImportance.HIGH,
            name: "Reminder Channel",
        }
    },
    CATEGORIES: {
        REMINDER_ACTIONS: {
            id: 'reminder-actions',
            actions: [
                {
                    identifier: 'snooze',
                    buttonTitle: 'Snooze',
                    options: {
                        opensAppToForeground: true,
                        isDestructive: false,
                        isAuthenticationRequired: false,
                    },
                },
                {
                    identifier: 'done',
                    buttonTitle: 'Done',
                    options: {
                        opensAppToForeground: true,
                        isDestructive: false,
                        isAuthenticationRequired: false,
                    },
                },
            ]
        },
        NO_ACTION: { id: 'no-action', actions: [] }
    }
}