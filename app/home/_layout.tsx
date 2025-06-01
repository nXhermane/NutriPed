import { Center } from "@/components/ui/center";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useGoogleAuth } from "@/src/context";
import { router } from "expo-router";
import { icons } from "lucide-react-native";
import {
  TabList,
  Tabs,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
} from "expo-router/ui";
import React, { Children, ReactNode, useEffect } from "react";
import { Icon } from "@/components/ui/icon";
import { View } from "@/components/ui/view";

export default function Layout() {
  const { user } = useGoogleAuth();
  useEffect(() => {
    if (user == null) router.replace("./../");
  }, [user]);
  return (
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
          className={`font-light text-2xs text-typography-primary_light ${isFocused ? "text-primary-c" : ""} `}
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
      className={`h-v-5 w-5 text-typography-primary_light ${isFocused ? "text-primary-c" : ""}`}
    />
  );
};
// export function HomeHeader() {
//   const { user } = useGoogleAuth();
//   return (
//      <View style={{
//         //  height: 140,
//         width: '100%',

//      }} className={"w-full bg-background-secondary h-v-24"}>

//      </View>
//   );
// }
