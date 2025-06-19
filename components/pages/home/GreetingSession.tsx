import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useGoogleAuth } from "@/src/context";
import React from "react";

export function GreetingSession() {
  const { user } = useGoogleAuth();
  const getGreetingWithName = (name: string): string => {
    const hour = new Date().getHours();
    const greeting = hour >= 5 && hour < 18 ? "Bonjour" : "Bonsoir";
    return `${greeting} ${name}`;
  };
  return (
    <VStack className={""}>
      <Heading className={"font-h2 text-xl text-typography-primary"}>
        {getGreetingWithName(user?.given_name!)}
      </Heading>
      <Text className={"font-body text-sm text-typography-primary_light"}>
        Diagnostic nutritionnel pédiatrique
      </Text>
    </VStack>
  );
}
