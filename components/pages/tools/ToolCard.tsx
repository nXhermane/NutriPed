import { CardPressEffect } from "@/components/custom/motion";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { ChevronRight, icons } from "lucide-react-native";
import { MotiView } from "moti";
import React, { useState } from "react";

export interface ToolCardProps {
  name: string;
  desc: string;
  iconName: keyof typeof icons;
  onPress?: () => void;
}

const ToolCardComponent: React.FC<ToolCardProps> = ({
  name,
  desc,
  iconName,
  onPress = () => {},
}) => {
  const LucideIcon = icons[iconName];
  const [pressed, setPressed] = useState<boolean>(false);

  return (
    <CardPressEffect
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      <HStack
        className={
          "h-v-16 items-center justify-between gap-3 rounded-xl bg-background-secondary px-3 py-2"
        }
      >
        <Box
          className={
            "h-v-12 w-v-12 items-center justify-center rounded-lg bg-background-primary"
          }
        >
          <Icon as={LucideIcon} className={"text-typography-primary"} />
        </Box>
        <VStack className="flex-1 gap-1">
          <Heading className={"font-h4 text-base text-typography-primary font-medium"}>
            {name}
          </Heading>
          <Text className={"font-light text-xs text-typography-primary_light"}>
            {desc}
          </Text>
        </VStack>
        <MotiView
          from={{ translateX: 0 }}
          transition={{
            type: "timing",
            duration: 200,
          }}
          animate={{ translateX: pressed ? 10 : 0 }}
          className={"items-end justify-center"}
        >
          <Icon as={ChevronRight} />
        </MotiView>
      </HStack>
    </CardPressEffect>
  );
};

export const ToolCard = React.memo(ToolCardComponent);
