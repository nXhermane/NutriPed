import { VStack } from "@/components/ui/vstack";
import { SessionHeader } from "./shared/SessionHeader";
import { HStack } from "@/components/ui/hstack";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import { icons } from "lucide-react-native";
import React, { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { TOOLS_DATA } from "@/src/constants/ui";
import { CardPressEffect, FadeInCardX } from "@/components/custom/motion";
import { router } from "expo-router";
export const QuickAccessSession = () => {
  const QuickAccessTools = TOOLS_DATA.filter(item => item.isQuickAccess);
  return (
    <VStack className="w-full">
      <SessionHeader
        title="Accès rapide"
        actionName="Voir plus"
        onActionPress={() => {
          router.push("/(screens)/tools");
        }}
      />
      <HStack className={"gap-2 pt-v-4"}>
        {QuickAccessTools.map((item, index) => (
          <FadeInCardX key={item.code} delayNumber={index + 3}>
            <QuickToolCard
              name={item.name}
              desc={item.desc}
              iconName={item.iconName as keyof typeof icons}
              key={index}
              onPress={() =>
                router.navigate({
                  pathname: "/(screens)/tools/[tool]",
                  params: {
                    tool: item.code,
                  },
                })
              }
            />
          </FadeInCardX>
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
        "elevation-sm h-22 w-22 items-center justify-center gap-1 rounded-xl bg-background-secondary"
      }
    >
      <Center className={"h-10 w-10 rounded-lg"}>
        <Icon as={LucideIcon} className={"h-5 w-5 text-typography-primary"} />
      </Center>
      <VStack className={"items-center"}>
        <Text
          className={"font-body text-xs font-normal text-typography-primary"}
        >
          {name}
        </Text>
        {/* <Text
          className={
            "text-center font-light text-[8px] text-typography-primary_light"
          }
        >
          {desc}
        </Text> */}
      </VStack>
    </CardPressEffect>
  );
};
