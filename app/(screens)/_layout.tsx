import { ProtectedRoute } from "@/components/pages/shared";
import { Stack } from "expo-router";
import { View, Text } from "react-native";

const ScreenLayout = () => {
  return (
    <ProtectedRoute>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none",
        }}
      ></Stack>
    </ProtectedRoute>
  );
};

export default ScreenLayout;
