import { Text } from "@/components/ui/text";
import React, { useEffect } from "react";
import { Center } from "@/components/ui/center";
import { useRouter } from "expo-router";
import { useGoogleAuth } from "@/src/context";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { AppConstants } from "@/src/constants";
import { AppLogo } from "@/components/custom";

export default function Index() {
  const router = useRouter();
  const { user } = useGoogleAuth();

  useEffect(() => {
    setTimeout(async () => {
      if (user) {
        router.replace("/(tabs)");
      } else {
        router.replace("./onboarding");
      }
    }, 2000);
  }, [user, router]);

  return (
    <Center className={"bg-background-primary"} style={{ flex: 1 }}>
      <AppLogo className={"aspect-[320/320] h-v-32"} />
      <VStack className={"absolute bottom-8 items-center gap-4"}>
        <Heading className="font-heading text-h2 color-typography-primary">
          {AppConstants.app_name}
        </Heading>
        <Text
          className={
            "font-light_italic text-subtitle3 color-typography-primary_light"
          }
        >
          {AppConstants.app_version}
        </Text>
      </VStack>
    </Center>
  );
}
