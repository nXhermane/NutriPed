import { VStack } from "@/components/ui/vstack";
import { SessionHeader } from "./shared/SessionHeader";
import { HStack } from "@/components/ui/hstack";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import { icons } from "lucide-react-native";
import { Pressable } from "@/components/ui/pressable";
import React, { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { TOOLS_DATA } from "@/src/constants/ui";
import { MotiView } from "moti";
import { CardPressEffect } from "@/components/custom/motion";
export const QuickAccessSession = () => {
  const QuickAccessTools = TOOLS_DATA.filter(item => item.isQuickAccess);
  return (
    <VStack>
      <SessionHeader
        title="Quick Access"
        actionName="See more"
        onActionPress={() =>
          console.warn("Implement navigate to tools session")
        }
      />
      <HStack className={"gap-2 pt-v-4"}>
        {QuickAccessTools.map((item, index) => (
          <QuickToolCard
            name={item.name}
            desc={item.desc}
            iconName={item.iconName as keyof typeof icons}
            key={index}
            onPress={() => console.log("Pressed on tools", item.code)}
          />
        ))}
      </HStack>
    </VStack>
  );
};

export interface QuickToolCardProps {
  name: string;
  desc: string;
  iconName: keyof typeof icons;
  onPress?: () => void;
  key: number;
}
export const QuickToolCard: React.FC<QuickToolCardProps> = ({
  name,
  desc,
  iconName,
  onPress = () => {},
}) => {
  const LucideIcon = icons[iconName];
  const [pressed, setPressed] = useState(false);

  return (
    <CardPressEffect
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      className={
        "elevation-sm h-v-22 w-22 items-center justify-center gap-1 rounded-xl bg-background-secondary"
      }
    >
      <Center className={"h-9 w-9 rounded-full bg-primary-c_light"}>
        <Icon as={LucideIcon} className={"h-5 w-5 text-background-primary"} />
      </Center>
      <VStack className={"items-center"}>
        <Text className={"font-h4 text-xs text-typography-primary"}>
          {name}
        </Text>
        <Text
          className={
            "text-center font-light text-[8px] text-typography-primary_light"
          }
        >
          {desc}
        </Text>
      </VStack>
    </CardPressEffect>
  );
};
