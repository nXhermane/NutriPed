import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { router } from "expo-router";
import { X } from "lucide-react-native";
import React from "react";

export interface PdfViewerHeaderProps {
  name: string;
}
export const PdfViewerHeader: React.FC<PdfViewerHeaderProps> = ({ name }) => {
  return (
    <HStack
      className={
        "p-safe dark:elevation-md h-v-20 w-full items-center justify-center gap-2 bg-background-secondary px-2"
      }
    >
      <Pressable
        onPress={() => router.back()}
        className="items-center justify-center"
      >
        <Icon as={X} className={"h-7 w-7 text-typography-primary"} />
      </Pressable>
      <Box className="w-[80%]">
        <Heading className="font-h4 text-sm font-medium" numberOfLines={1}>
          {name}
        </Heading>
      </Box>
    </HStack>
  );
};
