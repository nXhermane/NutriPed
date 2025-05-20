import React, { useEffect, useRef, useState } from "react";
import "react-native-reanimated";
import "react-native-get-random-values";
import { Text } from "@/components/ui/text";
import { View, ActivityIndicator, Platform, Button } from "react-native";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import {
  AppStateProvider,
  DatabaseProvider,
  GoogleAuthProvider,
  InitializationProvider,
  PediatricAppProvider,
  useInitialization,
} from "@context";
import { EventProvider } from "domain-eventrix/react";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
export default function RootLayout() {
  return (
    <GluestackUIProvider mode="dark">
      <AppStateProvider>
        <EventProvider>
          <DatabaseProvider>
            <GoogleAuthProvider>
              <PediatricAppProvider>
                <InitializationProvider>
                  <Main />
                </InitializationProvider>
              </PediatricAppProvider>
            </GoogleAuthProvider>
          </DatabaseProvider>
        </EventProvider>
      </AppStateProvider>
    </GluestackUIProvider>
  );
}

function Main() {
  const {
    isInitialized,
    isLoading,
    progress,
    currentStage,
    statusMessage,
    error,
    initializeApp,
  } = useInitialization();

  const [expoPushToken, setExpoPushToken] = useState("");
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
    []
  );
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.EventSubscription>({});
  const responseListener = useRef<Notifications.EventSubscription>({});

  useEffect(() => {
    if (!isInitialized && !isLoading) {
      initializeApp();
    }
  }, [isInitialized, isLoading]);

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => token && setExpoPushToken(token)
    );

    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync().then((value) =>
        setChannels(value ?? [])
      );
    }
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>{statusMessage || "Initialisation en cours..."}</Text>
        <Text>Étape : {currentStage}</Text>
        <Text>Progression : {progress.toFixed(0)}%</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "red" }}>{error}</Text>
        <Text
          onPress={initializeApp}
          style={{ textDecorationLine: "underline", marginTop: 10 }}
        >
          Réessayer
        </Text>
      </View>
    );
  }

  if (!isInitialized) {
    return (
      <View style={styles.centered}>
        <Text>L'application n'a pas pu être initialisée.</Text>
      </View>
    );
  }

  return (
    <View style={styles.centered}>
      <Text style={{ textAlign: "center" }}>
        Bienvenue dans l'application !
      </Text>

      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <Text>Your expo push token: {expoPushToken}</Text>
        <Text>{`Channels: ${JSON.stringify(
          channels.map((c) => c.id),
          null,
          2
        )}`}</Text>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text>
            Title: {notification && notification.request.content.title}{" "}
          </Text>
          <Text>Body: {notification && notification.request.content.body}</Text>
          <Text>
            Data:{" "}
            {notification && JSON.stringify(notification.request.content.data)}
          </Text>
        </View>
        <Button
          title="Press to schedule a notification"
          onPress={async () => {
            await schedulePushNotification();
          }}
        />
      </View>
    </View>
  );
}

const styles = {
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  } as const,
};
async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: "Here is the notification body",
      data: { data: "goes here", test: { test1: "more data" } },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
    },
  });
  // Second, call scheduleNotificationAsync()
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Look at that notification",
      body: "I'm so proud of myself!",
    },
    trigger: null,
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("myNotificationChannel", {
      name: "A channel is needed for the permissions prompt to appear",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    alert("Failed to get push token for push notification!");
    return;
  }
  // Learn more about projectId:
  // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
  // EAS projectId is used here.
  try {
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      throw new Error("Project ID not found");
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;
    console.log(token);
  } catch (e) {
    token = `${e}`;
  }

  return token;
}
