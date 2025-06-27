import {
  GreetingSession,
  HomeHeader,
  HomeSearchingBar,
  InitAppBottomSheet,
  LastPatientsSession,
  NextReminderSession,
  QuickAccessSession,
} from "@pages/home";
import { Box } from "@/components/ui/box";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { useGoogleAuth, useInitialization } from "@/src/context";

export default function Home() {
  const [showInitializationSheet, setShowInitializationSheet] =
    useState<boolean>(false);
  const { user } = useGoogleAuth();
  const { isInitialized } = useInitialization();

  useEffect(() => {
    if (user) {
      if (!isInitialized) setShowInitializationSheet(true);
    }
  }, [isInitialized]);

  return (
    <Box className={"flex-1 bg-background-primary"}>
      <HomeHeader />
      <ScrollView
        contentContainerClassName="px-4 gap-v-4 py-v-3"
        showsVerticalScrollIndicator={false}
      >
        <GreetingSession />
        <HomeSearchingBar />
        <QuickAccessSession />
        <LastPatientsSession />
        <NextReminderSession useMoked />
        <InitAppBottomSheet
          showInitializationSheet={showInitializationSheet}
          onClose={() => setShowInitializationSheet(false)}
        />
      </ScrollView>
    </Box>
  );
}
