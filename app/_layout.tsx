import React from "react";
import "react-native-reanimated";
import "react-native-get-random-values";
import { Text } from "@/components/ui/text";
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
import { View } from "@/components/ui/view";
import { useAppInitialization } from "@hooks";
import { Box } from "@/components/ui/box";

export default function RootLayout() {
  const { onLayoutRootView, appIsReady } = useAppInitialization();
  if (!appIsReady) {
    return null;
  }
  return (
    <GluestackUIProvider mode={"system"}>
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
  );
}

function Route() {
  return (
    <View>
      <Text>Bienvenue dans Malnutrix</Text>
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
