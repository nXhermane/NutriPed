import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { Icon } from "@/components/ui/icon";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";
import { Center } from "@/components/ui/center";
import { ReactNode } from "react";
import { Box } from "@/components/ui/box";

export interface StackScreenHeaderProps {
  name: string;
  desc?: string;
  right?: ReactNode;
}
export const StackScreenHeader: React.FC<StackScreenHeaderProps> = ({
  name,
  desc,
  right,
}) => {
  return (
    <HStack
      className={
        "p-safe dark:elevation-md w-full h-v-20 items-center justify-between bg-background-secondary"
      }
    >
      <HStack>
        <Pressable
          onPress={() => router.back()}
          className="left-4 h-full items-center justify-center"
        >
          <Icon
            as={ChevronLeft}
            className={"h-7 w-7 text-typography-primary"}
          />
        </Pressable>
        <Center className={"ml-4 h-full"}>
          <Heading
            className={"font-h2 text-lg font-semibold text-typography-primary"}
          >
            {name}
          </Heading>
          {desc && (
            <Text className={"font-body text-xs text-typography-primary_light"}>
              {desc}
            </Text>
          )}
        </Center>
      </HStack>
      <HStack className="items-center pr-4">{right}</HStack>
    </HStack>
  );
};
