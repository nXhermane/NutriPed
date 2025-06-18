import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { Icon } from "@/components/ui/icon";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";
import { Center } from "@/components/ui/center";

export interface StackScreenHeaderProps {
  name: string;
  desc?: string;
}
export const StackScreenHeader: React.FC<StackScreenHeaderProps> = ({
  name,
  desc,
}) => {
  return (
    <HStack
      className={
        "p-safe elevation-md w-ful h-v-20 items-center justify-center bg-background-secondary"
      }
    >
      <Pressable
        onPress={() => router.back()}
        className="p-safe absolute left-4 h-full items-center justify-center"
      >
        <Icon as={ChevronLeft} className={"h-7 w-7 text-typography-primary"} />
      </Pressable>
      <Center className={"ml-4"}>
        <Heading className={"font-h1 text-lg text-typography-primary"}>
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
