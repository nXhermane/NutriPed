import { GreetingSession, HomeHeader, HomeSearchingBar, QuickAccessSession } from "@pages/home";
import { Box } from "@/components/ui/box";
import React from "react";
import { ScrollView } from "react-native";

export default function Home() {
  return (
    <Box className={"flex-1 bg-background-primary"}>
      <HomeHeader />
      <ScrollView contentContainerClassName="px-4 gap-v-4" showsVerticalScrollIndicator={false}>
       <GreetingSession />
       <HomeSearchingBar />
       <QuickAccessSession />
      </ScrollView>
    </Box>
  );
}
