import { AppLogo } from "@/components/custom";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { AppConstants } from "@/src/constants";
import { useGoogleAuth, useUI } from "@/src/context";
import { Moon, Sun } from "lucide-react-native";
import React from "react";

export function HomeHeader() {
  const { user, logout } = useGoogleAuth();
  const { handleColorMode, colorMode } = useUI();

  return (
    <HStack
      className={
        "p-safe elevation-md h-v-20 w-full justify-between bg-background-secondary pb-2"
      }
    >
      <HStack className={"items-center gap-3 pl-4"}>
        <AppLogo className={"h-8 w-4"} />
        <Text className={" font-h2 text-xl text-typography-primary"}>
          {AppConstants.app_name}
        </Text>
      </HStack>
      <HStack className={"items-center gap-4 pr-4"}>
        <Pressable onPress={() => handleColorMode()}>
          <Icon as={colorMode === "dark" ? Sun : Moon} className={"h-6 w-6"} />
        </Pressable>
        <Pressable onPress={logout}>
          <Avatar className={"h-9 w-9"}>
            <AvatarFallbackText>{user?.name}</AvatarFallbackText>
            <AvatarImage
              source={{
                uri: user?.picture!,
              }}
            ></AvatarImage>
          </Avatar>
        </Pressable>
      </HStack>
    </HStack>
  );
}
