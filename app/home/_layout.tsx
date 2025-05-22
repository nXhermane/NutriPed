import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import { useGoogleAuth } from "@/src/context";
import { router } from "expo-router";
import React, { useEffect } from "react";

export default function Layout() {
  const { user } = useGoogleAuth();
  useEffect(() => {
    if (user == null) router.replace("./../");
  }, [user]);
  return (
    <Center style={{ flex: 1 }}>
      <Text>Home Pages</Text>
    </Center>
  );
}
