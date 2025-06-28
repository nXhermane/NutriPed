import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { router } from "expo-router";
import { ChartLineIcon, X } from "lucide-react-native";
import { Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
export interface ChartDetailHeaderProps {
  name: string;
  desc?: string;
}
export const ChartDetailHeader: React.FC<ChartDetailHeaderProps> = ({
  name,
  desc,
}) => {
  return (
    <HStack
      className={
        "p-safe dark:elevation-md w-ful h-v-20 items-center justify-center bg-background-primary"
      }
    >
      <Pressable
        onPress={() => router.back()}
        className="p-safe absolute left-4 h-full items-center justify-center"
      >
        <Icon as={X} className={"h-7 w-7 text-typography-primary"} />
      </Pressable>
      <Center className={"ml-4"}>
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
  );
};
