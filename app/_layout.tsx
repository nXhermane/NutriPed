import "react-native-reanimated";
import "@/global.css";
import { Stack } from "expo-router";
import {
  GoogleAuthProvider,
  ToastProvider,
  UIProvider,
} from "@/src/context";
export default function RootLayout() {
  return (
    <UIProvider>
      <ToastProvider>
        <GoogleAuthProvider>
          <Stack />
        </GoogleAuthProvider>
      </ToastProvider>
    </UIProvider>
  );
}
