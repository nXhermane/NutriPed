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
import { FadeInCardY as FadeInCard } from "@/components/custom/motion";

export default function Home() {
  const [showInitializationSheet, setShowInitializationSheet] =
    useState<boolean>(false);
  const { user } = useGoogleAuth();
  const { isInitialized } = useInitialization();

  useEffect(() => {
    if (user) {
      if (!isInitialized) {
        setTimeout(() => {
          setShowInitializationSheet(true);
        }, 300);
      }
    }
  }, [isInitialized, user]);

  return (
    <Box className={"flex-1 bg-background-primary"}>
      <HomeHeader />
      <ScrollView
        contentContainerClassName="px-4 gap-v-4 py-v-3"
        showsVerticalScrollIndicator={false}
      >
        <FadeInCard delayNumber={2}>
          <GreetingSession />
        </FadeInCard>

        <FadeInCard delayNumber={3}>
          <HomeSearchingBar />
        </FadeInCard>
        <FadeInCard delayNumber={4}>
          <QuickAccessSession />
        </FadeInCard>

        <FadeInCard delayNumber={5}>
          <LastPatientsSession />
        </FadeInCard>
        <FadeInCard delayNumber={6}>
          <NextReminderSession useMoked />
        </FadeInCard>

        <InitAppBottomSheet
          showInitializationSheet={showInitializationSheet}
          onClose={() => setShowInitializationSheet(false)}
        />
      </ScrollView>
    </Box>
  );
}
