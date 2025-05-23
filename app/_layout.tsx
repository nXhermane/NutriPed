import React, { createContext, useContext, useState } from "react";
import "react-native-reanimated";
import "react-native-get-random-values";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import {
  AppStateProvider,
  DatabaseProvider,
  GoogleAuthProvider,
  InitializationProvider,
  NotificationProvider,
  PediatricAppProvider,
} from "@context";
import { EventProvider } from "domain-eventrix/react";
import { useAppInitialization } from "@hooks";
import { Box } from "@/components/ui/box";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";

export interface ColorModeContextType {
  colorMode: "system" | "dark" | "light";
  handleColorMode: (value?: "dark" | "light" | "system") => void;
}
export const ColorModeContext = createContext<ColorModeContextType>(
  {} as ColorModeContextType
);
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { onLayoutRootView, appIsReady } = useAppInitialization();
  const [colorMode, setColorMode] = useState<"dark" | "light" | "system">(
    "system"
  );
  const handleColorMode = (value?: "dark" | "system" | "light") => {
    setColorMode(prev => {
      if (value) {
        return value;
      }
      return prev === "light" ? "dark" : "light";
    });
  };
  if (!appIsReady) {
    return null;
  }
  const gluestackMode = Platform.OS === "web" ? "dark" : "system";
  return (
    <>
      <StatusBar
        style="auto"
        backgroundColor={`${colorMode == "light" ? "#F6F6F6" : "#272625"}`}
      />
      <ColorModeContext.Provider value={{ colorMode, handleColorMode }}>
        <GluestackUIProvider mode={colorMode}>
          <Box style={{ flex: 1 }} onLayout={onLayoutRootView}>
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
          </Box>
        </GluestackUIProvider>
      </ColorModeContext.Provider>
    </>
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

export function useColorMode() {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error(
      "Please use Color mode context inside of color mode Provider."
    );
  }
  return { ...context };
}

const styles = {
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  } as const,
};
