import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import React, { ReactNode } from "react";
import { HStack } from "@/components/ui/hstack";
export interface TabHeaderProps {
  name: string;
  desc?: string;
  headerRight?: ReactNode;
}
export const TabHeader: React.FC<TabHeaderProps> = ({
  name,
  desc,
  headerRight,
}) => {
  return (
    <HStack
      className={
        "p-safe elevation-md h-v-20 w-full justify-between bg-background-secondary"
      }
    >
      <VStack className={"ml-4"}>
        <Heading className={"font-h1 text-2xl text-typography-primary"}>
          {name}
        </Heading>
        {desc && (
          <Text className={"font-light text-sm text-typography-primary_light"}>
            {desc}
          </Text>
        )}
      </VStack>
      {headerRight && (
        <Box className={"mr-4 h-full max-w-[40%] bg-black"}>{headerRight}</Box>
      )}
    </HStack>
  );
};
