import { createContext, ReactNode, useEffect, useState } from "react";
import React from "react";
import { View } from "@/components/ui/view";
import { Text } from "@/components/ui/text";
import { useEventBus } from "domain-eventrix/react";
import {
  PediatricAppProvider as AdapterPediatricAppProvider,
  IndexedDBConnection,
} from "@/adapter";

import { IEventBus } from "@/core/shared";
import { Center } from "@/components/ui/center";
import { useDatabase } from "./DatabaseContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import colors from "tailwindcss/colors";
import { Link, LinkText } from "@/components/ui/link";
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
        {!isTimeOut && <Spinner size={"large"} color={colors.blue["600"]} />}
        {isTimeOut && <Link href="https://github.com/nXhermane">
          <LinkText>Contacter le developpeur</LinkText>
        </Link>}
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
