import "react-native-reanimated";
import "@/global.css";
import { Stack } from "expo-router";
import {
  AppStateProvider,
  DatabaseProvider,
  GoogleAuthProvider,
  PediatricAppProvider,
  ToastProvider,
  UIProvider,
} from "@/src/context";
import { EventProvider } from "domain-eventrix/react";
export default function RootLayout() {
  return (
    <UIProvider>
      <ToastProvider>
        <AppStateProvider>
          <EventProvider>
            <DatabaseProvider>
              <GoogleAuthProvider>
                <PediatricAppProvider>
                  <Stack />
                </PediatricAppProvider>
              </GoogleAuthProvider>
            </DatabaseProvider>
          </EventProvider>
        </AppStateProvider>
      </ToastProvider>
    </UIProvider>
  );
}
