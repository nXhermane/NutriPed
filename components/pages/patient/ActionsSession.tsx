import { CardPressEffect } from "@/components/custom/motion";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { icons } from "lucide-react-native";
import { MotiView, TransitionConfig } from "moti";
import React from "react";

export interface ActionBtnSessionProps {
  actions?: ActionBtnProps[];
  isVisible?: boolean;
}
export const ActionBtnSession: React.FC<ActionBtnSessionProps> = ({
  isVisible = false,
  actions = [],
}) => {
  if (!isVisible) return null;
  return (
    <MotiView
      from={{
        translateY: 50,
        opacity: 0.1,
      }}
      animate={{
        translateY: 0,
        opacity: 1,
      }}
      transition={{
        type: "spring",
        duration: 500,
      }}
      exit={{ translateY: -50 }}
      exitTransition={{
        type: "timing",
        delay: 300,
      }}
      className={
        "absolute bottom-0 h-v-20 w-full flex-row items-center justify-between px-8"
      }
    >
      {actions.map((action, index) => (
        <ActionBtn key={index} {...action} />
      ))}
    </MotiView>
  );
};

export interface ActionBtnProps {
  toolTip: string;
  icon: keyof typeof icons;
  onPress?: () => void;
  classNameColor?: string;
}
export const ActionBtn: React.FC<ActionBtnProps> = ({
  onPress = () => void 0,
  classNameColor = "",
  toolTip,
  icon,
}) => {
  const LucideIcon = icons[icon];
  return (
    <CardPressEffect
      onPress={onPress}
      className={`items-center justify-center p-1 ${classNameColor} h-10 w-10 rounded-full`}
    >
      <Icon as={LucideIcon} className={"h-6 w-6 text-typography-primary"} />
    </CardPressEffect>
  );
};
