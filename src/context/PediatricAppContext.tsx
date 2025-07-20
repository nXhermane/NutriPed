import { createContext, ReactNode, useEffect, useState } from "react";
import React from "react";
import { Text } from "@/components/ui/text";
import { useEventBus } from "domain-eventrix/react";
import ReactNativeResart from "react-native-restart";
import { PediatricAppProvider as AdapterPediatricAppProvider } from "@/adapter";
import { openBrowserAsync } from "expo-web-browser";
import { IEventBus } from "@/core/shared";
import { Center } from "@/components/ui/center";
import { useDatabase } from "./DatabaseContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Button, ButtonIcon } from "@/components/ui/button";
import { LifeBuoy, Mail, MessageCircle, RotateCcw } from "lucide-react-native";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Loading } from "@/components/custom";
// BETA:
const queryClient = new QueryClient();

export interface IPediatricAppContext {}

export const PediatricAppContext = createContext<IPediatricAppContext>({});

export interface PediatricAppProviderType {
  children: ReactNode;
  onLoading?: () => ReactNode;
}

export const PediatricAppProvider: React.FC<PediatricAppProviderType> = ({
  children,
  onLoading = () => null,
}) => {
  const eventBus = useEventBus();
  const { db, dbOpened } = useDatabase();
  const [uiMessage, setUiMessage] = useState<string>(
    "Chargement de l'application, veuillez patienter..."
  );
  const [isTimeOut, setIsTimeOut] = useState<boolean>(false);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setUiMessage(
        "Le chargement prend plus de temps que prévu. Vous pouvez essayer de redémarrer l'application. Si le problème persiste, veuillez contacter le développeur."
      );
      setIsTimeOut(true);
    }, 1500);

    return () => {
      clearTimeout(timeOutId);
    };
  }, []);
  if (!dbOpened)
    return (
      <Center className="flex-1 gap-5 bg-background-primary px-4">
        <Text className="text-center font-body text-sm font-normal">
          {uiMessage}
        </Text>
        {!isTimeOut && <Loading />}
        {isTimeOut && (
          <>
            <Button
              className="rounded-full bg-primary-c_light"
              onPress={() => ReactNativeResart.restart()}
            >
              <ButtonIcon as={RotateCcw} className="text-typography-primary" />
            </Button>
            <HStack className="gap-4">
              <Pressable
                className="rounded-full bg-indigo-600 p-3"
                onPress={() => {
                  console.log("NON IMplementer");
                }}
              >
                <Icon as={MessageCircle} className="text-typography-primary" />
              </Pressable>
              <Pressable
                className="rounded-full bg-emerald-600 p-3"
                onPress={() => {
                  console.log("NON IMPlementer");
                }}
              >
                <Icon as={Mail} className="p-2 text-typography-primary" />
              </Pressable>
              <Pressable
                className="rounded-full bg-orange-600 p-3"
                onPress={() => openBrowserAsync("https://github.com/nXhermane")}
              >
                <Icon as={LifeBuoy} className="p-2 text-typography-primary" />
              </Pressable>
            </HStack>
          </>
        )}
      </Center>
    );
  return (
    <PediatricAppContext.Provider value={{}}>
      <QueryClientProvider client={queryClient}>
        <AdapterPediatricAppProvider
          dbConnection={db as any}
          expo={db as any}
          eventBus={eventBus as unknown as IEventBus}
        >
          {children}
        </AdapterPediatricAppProvider>
      </QueryClientProvider>
    </PediatricAppContext.Provider>
  );
};
