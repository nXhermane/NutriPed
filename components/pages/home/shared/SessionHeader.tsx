import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import React from "react";

export interface SessionHeaderProps {
  title: string;
  actionName?: string;
  onActionPress?: () => void;
}
export const SessionHeader: React.FC<SessionHeaderProps> = ({
  actionName,
  title,
  onActionPress = () => {},
}) => {
  return (
    <HStack className={"items-center justify-between"}>
      <Heading className={"font-h2 text-xl text-typography-primary"}>
        {title}
      </Heading>
      {actionName && (
        <Pressable onPress={onActionPress}>
          <Text className={"font-light text-sm text-secondary-c"}>
            {actionName}
          </Text>
        </Pressable>
      )}
    </HStack>
  );
};
