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

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { onLayoutRootView, appIsReady } = useAppInitialization();
  if (!appIsReady) {
    return null;
  }
  return (
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
  );
}

function Route() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
