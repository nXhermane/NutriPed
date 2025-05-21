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
        REMINDER_ACTIONS: 'reminder-actions',
        NO_ACTION: 'no-action'
    }
}