// import React, {
//   createContext,
//   FC,
//   ReactNode,
//   useEffect,
//   useState,
//   useContext,
//   useRef,
//   useMemo,
// } from "react";
// import * as Notifications from "expo-notifications";
// import { Platform } from "react-native";
// import { ReminderNotificationInput } from "@/core/reminders";
// import { NOTIFICATION_CONFIG } from "@/adapter/config/notification/config";
// import ReminderNotificationService from "@/adapter/services/Notification/Notification";

// type Unsubscribe = () => void;
// if (Platform.OS != "web") {
//   Notifications.setNotificationHandler({
//     handleNotification: async () => ({
//       shouldShowBanner: true,
//       shouldShowList: true,
//       shouldPlaySound: false,
//       shouldSetBadge: false,
//     }),
//   });
// }
// export interface NotificationContextType {
//   scheduleNotification: (input: ReminderNotificationInput) => Promise<void>;
//   cancelNotification: (reminderId: string) => Promise<void>;
//   onNotificationReceived: (
//     callback: (notification: Notifications.Notification) => void
//   ) => Unsubscribe;
//   onNotificationResponse: (
//     callback: (response: Notifications.NotificationResponse) => void
//   ) => Unsubscribe;
// }

// export const NotificationContext =
//   createContext<NotificationContextType | null>(null);

// export interface NotificationProviderProps {
//   children: ReactNode;
// }

// export const NotificationProvider: FC<NotificationProviderProps> = ({
//   children,
// }) => {
//   const reminderNotificationService = useMemo(
//     () => new ReminderNotificationService(),
//     []
//   );
//   const receivedCallbacks = useRef<((n: Notifications.Notification) => void)[]>(
//     []
//   );
//   const responseCallbacks = useRef<
//     ((r: Notifications.NotificationResponse) => void)[]
//   >([]);
//   const onNotificationReceived = (
//     callback: (notification: Notifications.Notification) => void
//   ) => {
//     receivedCallbacks.current.push(callback);
//     return () => {
//       receivedCallbacks.current = receivedCallbacks.current.filter(
//         cb => cb !== callback
//       );
//     };
//   };
//   const onNotificationResponse = (
//     callback: (response: Notifications.NotificationResponse) => void
//   ) => {
//     responseCallbacks.current.push(callback);
//     return () => {
//       responseCallbacks.current = responseCallbacks.current.filter(
//         cb => cb !== callback
//       );
//     };
//   };

//   useEffect(() => {
//     if (Platform.OS === "android") {
//       for (const channel of Object.values(NOTIFICATION_CONFIG.CHANNEL)) {
//         Notifications.setNotificationChannelAsync(channel.id, {
//           name: channel.name,
//           importance: channel.importance,
//           sound: channel.sound,
//           vibrationPattern: channel.vibrationPattern,
//         });
//       }
//     }
//     if (Platform.OS != "web") {
//       for (const category of Object.values(NOTIFICATION_CONFIG.CATEGORIES)) {
//         Notifications.setNotificationCategoryAsync(category.id, [
//           ...category.actions.map(action => ({
//             identifier: action.identifier,
//             buttonTitle: action.buttonTitle,
//             options: {
//               opensAppToForeground: action.options.opensAppToForeground,
//               isDestructive: action.options.isDestructive,
//               isAuthenticationRequired: action.options.isAuthenticationRequired,
//             },
//             textInput: action.textInput,
//           })),
//         ]);
//       }

//       const receivedSubscription =
//         Notifications.addNotificationReceivedListener(notification => {
//           console.log("Notification reçue", notification);
//           for (const cb of receivedCallbacks.current) {
//             cb(notification);
//           }
//         });

//       const responseSubscription =
//         Notifications.addNotificationResponseReceivedListener(response => {
//           console.log("Interaction avec notification", response);
//           for (const cb of responseCallbacks.current) {
//             cb(response);
//           }
//         });
//       return () => {
//         receivedSubscription.remove();
//         responseSubscription.remove();
//       };
//     }
//   }, []);

//   const scheduleNotification = async (
//     input: ReminderNotificationInput
//   ): Promise<void> => {
//     try {
//       await reminderNotificationService.scheduleNotification(input);
//     } catch (e: unknown) {
//       console.error("Erreur lors de la planification de la notification", e);
//     }
//   };

//   async function cancelNotification(reminderId: string): Promise<void> {
//     try {
//       await reminderNotificationService.cancelNotfication(reminderId);
//     } catch (e) {
//       console.error("Erreur lors de l'annulation de notification", e);
//     }
//   }

//   return (
//     <NotificationContext.Provider
//       value={{
//         scheduleNotification,
//         cancelNotification,
//         onNotificationReceived,
//         onNotificationResponse,
//       }}
//     >
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// export function useNotification() {
//   const context = useContext(NotificationContext);
//   if (!context) {
//     throw new Error(
//       "useNotification doit être utilisé dans un NotificationProvider"
//     );
//   }
//   return context;
// }
// export function useNotificationReceivedHandler(
//   handler: (notification: Notifications.Notification) => void
// ) {
//   const { onNotificationReceived } = useNotification();
//   useEffect(() => {
//     const unsubscribe = onNotificationReceived(handler);
//     return () => {
//       unsubscribe();
//     };
//   }, [onNotificationReceived]);
// }
// export function useNotificationResponseHandler(
//   handler: (response: Notifications.NotificationResponse) => void
// ) {
//   const { onNotificationResponse } = useNotification();
//   useEffect(() => {
//     const unsubscribe = onNotificationResponse(handler);
//     return () => {
//       unsubscribe();
//     };
//   }, [onNotificationResponse]);
// }
