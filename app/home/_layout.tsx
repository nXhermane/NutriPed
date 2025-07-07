import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { icons } from "lucide-react-native";
import {
  TabList,
  Tabs,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
} from "expo-router/ui";
import React, { ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
import { ProtectedRoute } from "@/components/pages/shared";

export default function Layout() {
  return (
    <ProtectedRoute>
      <Tabs>
        <TabSlot />
        <TabList asChild>
          <CustomTabList>
            <TabTrigger name="Home" href="/home" asChild>
              <CustomTabButton name={"Accueil"} icon={"House"} />
            </TabTrigger>
            <TabTrigger name="Patients" href="/home/patients" asChild>
              <CustomTabButton name={"Patients"} icon={"Users"} />
            </TabTrigger>
            <TabTrigger name="Reminders" href="/home/reminders" asChild>
              <CustomTabButton name={"Rappels"} icon={"Bell"} />
            </TabTrigger>
            <TabTrigger name="Settings" href="/home/settings" asChild>
              <CustomTabButton name={"Paramètres"} icon={"Settings2"} />
            </TabTrigger>
          </CustomTabList>
        </TabList>
      </Tabs>
    </ProtectedRoute>
  );
}

interface CustomTabBarProps {
  children: ReactNode;
}
const CustomTabList: React.FC<CustomTabBarProps> = ({ children }) => {
  return (
    <HStack
      className={
        "h-v-12 w-full items-center justify-between bg-background-secondary px-5 py-1"
      }
    >
      {children}
    </HStack>
  );
};
interface CustomTabButtonProps extends TabTriggerSlotProps {
  name: string;
  icon: keyof typeof icons;
}

const CustomTabButton: React.FC<CustomTabButtonProps> = ({
  name,
  isFocused,
  style,
  icon,
  ...props
}) => {
  return (
    <Pressable {...props}>
      <VStack className={"items-center"}>
        <CustomTabButtonIcon name={icon} isFocused={isFocused} />
        <Text
          className={`font-light text-2xs font-normal text-typography-primary_light ${isFocused ? "text-primary-c_light" : ""} `}
        >
          {name}
        </Text>
      </VStack>
    </Pressable>
  );
};
interface CustomTabButtonIconProps {
  name: keyof typeof icons;
  isFocused?: boolean;
}
const CustomTabButtonIcon: React.FC<CustomTabButtonIconProps> = ({
  name,
  isFocused = false,
}) => {
  const LucideIcon = icons[name];
  return (
    <Icon
      as={LucideIcon}
      className={`h-v-5 w-5 text-typography-primary_light ${isFocused ? "text-primary-c_light" : ""}`}
    />
  );
};
