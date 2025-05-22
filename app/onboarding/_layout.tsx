import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import { useGoogleAuth } from "@/src/context";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";

export default function Layout() {
  const { user, login, logout, getUserInfo } = useGoogleAuth();
  const router = useRouter();
  useEffect(() => {
    if (user != null) router.replace("./../home");
  }, [user]);

  const handleLogin = async () => {
    try {
      const success = await login();
      if (success) router.replace("./../home");
    } catch (e: unknown) {
      console.error(e);
    }
  };
  return (
    <Center style={{ flex: 1 }}>
      <Text>On Boring Pages</Text>
      <Button
        onPress={async () => {
          await handleLogin();
        }}
      >
        <ButtonText>Se Connecter</ButtonText>
      </Button>
      <Button
        variant={"link"}
        onPress={async () => {
          await logout();
        }}
      >
        <ButtonText>Se Deconnecter</ButtonText>
      </Button>
    </Center>
  );
}
