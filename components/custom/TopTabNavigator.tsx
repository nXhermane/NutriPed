import React, { useState } from "react";
import { VStack } from "../ui/vstack";
import { HStack } from "../ui/hstack";
import { ScrollView } from "react-native";
import { Pressable } from "../ui/pressable";
import { Text } from "../ui/text";
import { Box } from "../ui/box";

export interface TopTabNaviagtorProps {
  tabs: { name: string; component: React.ReactNode }[];
}

export const TopTabNaviagtor: React.FC<TopTabNaviagtorProps> = React.memo(
  ({ tabs }) => {
    const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
    return (
      <VStack className="flex-1 bg-background-primary">
        <HStack className="h-v-8">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {tabs.map((item, index) => {
              return (
                <Pressable
                  key={index}
                  onPress={() => setCurrentTabIndex(index)}
                >
                  <TabItem
                    isCurrentTab={index === currentTabIndex}
                    label={item.name}
                  />
                </Pressable>
              );
            })}
          </ScrollView>
        </HStack>
        <ScrollView showsVerticalScrollIndicator={false}>
          {tabs[currentTabIndex].component}
        </ScrollView>
      </VStack>
    );
  }
);

export interface TabItemProps {
  isCurrentTab: boolean;
  label: string;
}

export const TabItem: React.FC<TabItemProps> = ({ label, isCurrentTab }) => {
  return (
    <VStack className={`w-52 flex-grow items-center bg-background-secondary`}>
      <Box
        className={`h-full w-full items-center justify-center px-3 ${isCurrentTab ? "bg-primary-c_light/5" : ""}`}
      >
        <Text
          className={`font-h4 text-sm font-medium ${isCurrentTab ? "text-typography-primary" : "text-typography-primary_light"}`}
        >
          {label}
        </Text>
      </Box>
      {isCurrentTab && (
        <Box className="absolute bottom-0 h-v-1 w-full bg-primary-c_light" />
      )}
    </VStack>
  );
};
