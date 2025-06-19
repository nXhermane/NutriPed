import "react-native-reanimated";
import "react-native-get-random-values";
import "@/global.css";
import React from "react";
import {
  AppStateProvider,
  DatabaseProvider,
  GoogleAuthProvider,
  InitializationProvider,
  NotificationProvider,
  PediatricAppProvider,
  ToastProvider,
  UIProvider,
} from "@context";

import { EventProvider } from "domain-eventrix/react";
import { useAppInitialization } from "@hooks";
import { Box } from "@/components/ui/box";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { KeyboardProvider } from "react-native-keyboard-controller";
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { onLayoutRootView, appIsReady } = useAppInitialization();
  if (!appIsReady) {
    return null;
  }
  return (
    <KeyboardProvider>
      <UIProvider>
        <Box style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <ToastProvider>
            <AppStateProvider>
              <EventProvider>
                <DatabaseProvider>
                  <GoogleAuthProvider>
                    <NotificationProvider>
                      <PediatricAppProvider>
                        <InitializationProvider>
                          <Route />
                        </InitializationProvider>
                      </PediatricAppProvider>
                    </NotificationProvider>
                  </GoogleAuthProvider>
                </DatabaseProvider>
              </EventProvider>
            </AppStateProvider>
          </ToastProvider>
        </Box>
      </UIProvider>
    </KeyboardProvider>
  );
}

function Route() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
      // initialRouteName="onboarding/index"
    >
      <Stack.Screen name={"home"} options={{ title: "Home" }} />
      <Stack.Screen
        name={"onboarding/index"}
        options={{ title: "Onboarding" }}
      />
      <Stack.Screen
        name={"(screens)"}
        options={{
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}
