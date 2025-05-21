import React, { createContext, FC, ReactNode, useEffect, useState, useContext, useRef, useMemo } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { ReminderNotificationInput } from "@/core/reminders";
import { NOTIFICATION_CONFIG } from "@/adapter/config/notification/config";
import ReminderNotificationService from "@/adapter/services/Notification/Notification";

export interface NotificationContextType {
    scheduleNotification: (input: ReminderNotificationInput) => Promise<void>;
    cancelNotification: (reminderId: string) => Promise<void>;

}

export const NotificationContext = createContext<NotificationContextType | null>(null);

export interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: FC<NotificationProviderProps> = ({ children }) => {

    const reminderNotificationService = useMemo(() => new ReminderNotificationService(), [])
    useEffect(() => {
        if (Platform.OS === "android") {
            for (const channel of Object.values(NOTIFICATION_CONFIG.CHANNEL)) {
                Notifications.setNotificationChannelAsync(channel.id, {
                    name: channel.name,
                    importance: channel.importance,
                    sound: "default",
                    vibrationPattern: [0, 250, 250, 250],
                });
            }
        }
        if (Platform.OS != 'web') {
            for (const category of Object.values(NOTIFICATION_CONFIG.CATEGORIES)) {
                Notifications.setNotificationCategoryAsync(category.id,
                    [...category.actions.map(action => ({
                        identifier: action.identifier,
                        buttonTitle: action.buttonTitle,
                        options: {
                            opensAppToForeground: action.options.opensAppToForeground,
                            isDestructive: action.options.isDestructive,
                            isAuthenticationRequired: action.options.isAuthenticationRequired,
                        },
                    }))]
                )
            }

        }


        // Abonnement aux notifications reçues
        const receivedSubscription = Notifications.addNotificationReceivedListener(notification => {
            console.log("Notification reçue", notification);
            // Gérer la notification reçue (update UI, etc.)
        });

        // Abonnement aux interactions utilisateur
        const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
            console.log("Interaction avec notification", response);
            // Gérer l'ouverture ou action utilisateur
        });
        return () => {
            receivedSubscription.remove();
            responseSubscription.remove();
        };
    }, []);

    const scheduleNotification = async (input: ReminderNotificationInput): Promise<void> => {
        try {
            await reminderNotificationService.scheduleNotification(input)
        } catch (e: unknown) {
            console.error("Erreur lors de la planification de la notification", e);

        }
    }

    async function cancelNotification(reminderId: string): Promise<void> {
        try {
            await reminderNotificationService.cancelNotfication(reminderId);
        } catch (e) {
            console.error("Erreur lors de l'annulation de notification", e);
        }
    }

    return (
        <NotificationContext.Provider value={{ scheduleNotification, cancelNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification doit être utilisé dans un NotificationProvider");
    }
    return context;
}


