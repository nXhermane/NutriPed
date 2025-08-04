import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import React from "react";

export interface SessionHeaderProps {
  title: string;
  actionName?: string;
  onActionPress?: () => void;
  rightNode?: () => React.ReactNode;
}
export const SessionHeader: React.FC<SessionHeaderProps> = ({
  actionName,
  title,
  onActionPress = () => {},
  rightNode,
}) => {
  return (
    <HStack className={"flex-1 items-center justify-between"}>
      <Heading
        className={"font-h2 text-base font-bold text-typography-primary"}
      >
        {title}
      </Heading>
      {actionName && (
        <Pressable onPress={onActionPress} className="p-1">
          <Text
            className={
              "font-body text-xs font-normal text-blue-800 dark:text-blue-200"
            }
          >
            {actionName}
          </Text>
        </Pressable>
      )}
      {rightNode && <Box className="bg-yellow-500">{rightNode()}</Box>}
    </HStack>
  );
};
