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
  onActionPress = ()=> {},
}) => {
  return (
    <HStack className={"justify-between items-center"}>
      <Heading className={"text-xl text-typography-primary font-h2"}>{title}</Heading>
      {actionName && (
        <Pressable onPress={onActionPress}>
          <Text className={"text-sm font-light text-secondary-c"}>{actionName}</Text>
        </Pressable>
      )}
    </HStack>
  );
};
