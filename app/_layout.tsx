import "react-native-reanimated";
import "react-native-get-random-values";
import "@/global.css"
import { Stack } from "expo-router";
// import { KeyboardProvider } from "react-native-keyboard-controller"; // Temporairement commenté - nécessite rebuild
import {
  AppStateProvider,
  DatabaseProvider,
  GoogleAuthProvider,
  InitializationProvider,
  PediatricAppProvider,
  ToastProvider,
  UIProvider,
} from "@/src/context";
import { NotificationProvider } from "@/src/context/NotificationContext";
import { NotificationServiceProvider } from "@/src/context/NotificationServiceContext";
import { EventProvider } from "domain-eventrix/react";
import { useSplashScreen } from "@/src/hooks/useSplashScreen";

function AppContent() {
  // Gère automatiquement le splash screen
  useSplashScreen();

  return <RootStack />;
}

export default function RootLayout() {
  return (
    // <KeyboardProvider> // Temporairement commenté - nécessite rebuild
      <UIProvider>
        <ToastProvider>
          <AppStateProvider>
            <EventProvider>
              <DatabaseProvider>
                <GoogleAuthProvider>
                  <NotificationProvider>
                    <NotificationServiceProvider>
                      <PediatricAppProvider>
                        <InitializationProvider>
                          <AppContent />
                        </InitializationProvider>
                      </PediatricAppProvider>
                    </NotificationServiceProvider>
                  </NotificationProvider>
                </GoogleAuthProvider>
              </DatabaseProvider>
            </EventProvider>
          </AppStateProvider>
        </ToastProvider>
      </UIProvider>
    // </KeyboardProvider>
  );
}

function RootStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        gestureEnabled: true,
        gestureDirection: "horizontal",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Accueil",
        }}
      />
      {/* Autres écrans seront ajoutés ici selon les besoins */}
    </Stack>
  );
}
