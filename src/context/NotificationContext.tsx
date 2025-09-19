import React, {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useState,
  useContext,
  useRef,
  useMemo,
} from "react";
import notifee, {
  EventType,
  Notification,
  NotificationPressAction,
} from "@notifee/react-native";
import { Platform } from "react-native";
import { ReminderNotificationInput } from "@/core/reminders";
import { NOTIFICATION_CONFIG } from "@/adapter/config/notification/config";
import ReminderNotificationService from "@/adapter/services/Notification/Notification";

type Unsubscribe = () => void;

export interface NotificationContextType {
  scheduleNotification: (input: ReminderNotificationInput) => Promise<void>;
  cancelNotification: (reminderId: string) => Promise<void>;
  onNotificationReceived: (
    callback: (notification: Notification) => void
  ) => Unsubscribe;
  onNotificationResponse: (
    callback: (response: NotificationPressAction) => void
  ) => Unsubscribe;
}

export const NotificationContext =
  createContext<NotificationContextType | null>(null);

export interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: FC<NotificationProviderProps> = ({
  children,
}) => {
  const reminderNotificationService = useMemo(
    () => new ReminderNotificationService(),
    []
  );

  const receivedCallbacks = useRef<((n: Notification) => void)[]>([]);
  const responseCallbacks = useRef<((r: NotificationPressAction) => void)[]>([]);

  const onNotificationReceived = (
    callback: (notification: Notification) => void
  ) => {
    receivedCallbacks.current.push(callback);
    return () => {
      receivedCallbacks.current = receivedCallbacks.current.filter(
        cb => cb !== callback
      );
    };
  };

  const onNotificationResponse = (
    callback: (response: NotificationPressAction) => void
  ) => {
    responseCallbacks.current.push(callback);
    return () => {
      responseCallbacks.current = responseCallbacks.current.filter(
        cb => cb !== callback
      );
    };
  };

  useEffect(() => {
    if (Platform.OS !== "web") {
      // Écouter les événements Notifee
      const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
        switch (type) {
          case EventType.DISMISSED:
            console.log('Notification dismissed:', detail.notification);
            break;
          case EventType.PRESS:
            console.log('Notification pressed:', detail.notification);
            console.log('Press action:', detail.pressAction);

            // Appeler tous les callbacks de réponse si pressAction existe
            if (detail.pressAction) {
              for (const cb of responseCallbacks.current) {
                cb(detail.pressAction);
              }
            }
            break;
          case EventType.ACTION_PRESS:
            console.log('Action pressed:', detail.pressAction);

            // Appeler tous les callbacks de réponse si pressAction existe
            if (detail.pressAction) {
              for (const cb of responseCallbacks.current) {
                cb(detail.pressAction);
              }
            }
            break;
        }
      });

      // Écouter les événements en arrière-plan
      notifee.onBackgroundEvent(async ({ type, detail }) => {
        switch (type) {
          case EventType.ACTION_PRESS:
            console.log('Background action pressed:', detail.pressAction);
            // Gérer les actions en arrière-plan si nécessaire
            break;
        }
      });

      return unsubscribe;
    }
  }, []);

  const scheduleNotification = async (
    input: ReminderNotificationInput
  ): Promise<void> => {
    try {
      await reminderNotificationService.scheduleNotification(input);
    } catch (e: unknown) {
      console.error("Erreur lors de la planification de la notification", e);
    }
  };

  async function cancelNotification(reminderId: string): Promise<void> {
    try {
      await reminderNotificationService.cancelNotfication(reminderId);
    } catch (e) {
      console.error("Erreur lors de l'annulation de notification", e);
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        scheduleNotification,
        cancelNotification,
        onNotificationReceived,
        onNotificationResponse,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification doit être utilisé dans un NotificationProvider"
    );
  }
  return context;
}

export function useNotificationReceivedHandler(
  handler: (notification: Notification) => void
) {
  const { onNotificationReceived } = useNotification();
  useEffect(() => {
    const unsubscribe = onNotificationReceived(handler);
    return () => {
      unsubscribe();
    };
  }, [onNotificationReceived]);
}

export function useNotificationResponseHandler(
  handler: (response: NotificationPressAction) => void
) {
  const { onNotificationResponse } = useNotification();
  useEffect(() => {
    const unsubscribe = onNotificationResponse(handler);
    return () => {
      unsubscribe();
    };
  }, [onNotificationResponse]);
}
