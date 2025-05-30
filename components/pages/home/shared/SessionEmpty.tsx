import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Box, icons } from "lucide-react-native";
import React from "react";

export interface SessionEmptyProps {
  message: string;
  iconName?: keyof typeof icons
}

export const SessionEmpty: React.FC<SessionEmptyProps> = ({ message ,iconName
}) => {
  const LucideIcon = iconName ? icons[iconName] : Box 
  return (
    <VStack
      className={
        "h-v-20 items-center justify-center gap-4 rounded-xl bg-background-50"
      }
    >
      <Icon as={LucideIcon} className={"h-6 w-6 text-typography-primary_light"} />
      <Text
        className={"font-light_italic text-sm text-typography-primary_light/50"}
        numberOfLines={1}
      >
        {message}
      </Text>
    </VStack>
  );
};
