import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { icons } from "lucide-react-native";
import React from "react";

export interface SessionEmptyProps {
  message: string;
  iconName?: keyof typeof icons;
}

export const SessionEmpty: React.FC<SessionEmptyProps> = ({
  message,
  iconName,
}) => {
  const LucideIcon = iconName ? icons[iconName] : Box;
  return (
    <VStack
      className={
        "h-fit w-[100%] items-center justify-center gap-4 rounded-xl bg-background-50 px-3 py-4"
      }
    >
      <Icon
        as={LucideIcon}
        className={"h-6 w-6 text-typography-primary_light"}
      />
      <Text
        className={
          "text-center font-light_italic text-sm text-typography-primary_light/50"
        }
      >
        {message}
      </Text>
    </VStack>
  );
};
