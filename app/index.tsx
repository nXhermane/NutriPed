import { Text } from "@/components/ui/text";
import React, { useEffect } from "react";
import { Center } from "@/components/ui/center";
import { useRouter } from "expo-router";
import { useGoogleAuth } from "@/src/context";

export default function Index() {
  const router = useRouter();
  const { user } = useGoogleAuth();
  useEffect(() => {
    setTimeout(async () => {
      if (user) {
        router.replace("./home");
      } else {
        router.replace("./onboarding");
      }
    }, 2000);
  }, [user]);
  return (
    <Center style={{ flex: 1 }}>
      <Text>Hello Index Page</Text>
    </Center>
  );
}
