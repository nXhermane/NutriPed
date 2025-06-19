import { createContext, ReactNode, useState } from "react";
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

  if (!dbOpened)
    return (
      <Center className="flex-1 bg-background-secondary">
        <Text>Please Reload The App</Text>
      </Center>
    );
  return (
    <PediatricAppContext.Provider value={{}}>
      <AdapterPediatricAppProvider
        dbConnection={db as any}
        expo={db as any}
        eventBus={eventBus as unknown as IEventBus}
      >
        {children}
      </AdapterPediatricAppProvider>
    </PediatricAppContext.Provider>
  );
};
