import { Platform } from "react-native";

export function isWebEnv(): boolean {
  return Platform.OS === "web";
}
