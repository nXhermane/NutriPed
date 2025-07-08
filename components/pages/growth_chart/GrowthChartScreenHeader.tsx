import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { useUI } from "@/src/context";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { X } from "lucide-react-native";

export interface GrowthChartScreenHeaderProps {
  name: string;
}

export const GrowthChartScreenHeader: React.FC<
  GrowthChartScreenHeaderProps
> = ({ name }) => {
    const {colorMode} = useUI()
  return (
    <BlurView className={'h-v-24 w-full p-0'} experimentalBlurMethod="dimezisBlurView" tint={colorMode} intensity={100}>
      <HStack
        className={
          "p-safe dark:elevation-md w-ful h-full items-center justify-center gap-2 px-2"
        }
      >
        <Pressable
          onPress={() => router.back()}
          className="items-center justify-center"
        >
          <Icon as={X} className={"h-7 w-7 text-typography-primary"} />
        </Pressable>
        <Box className="w-[80%]">
          <Heading className="font-h4 text-sm font-medium">{name}</Heading>
        </Box>
      </HStack>
    </BlurView>
  );
};
