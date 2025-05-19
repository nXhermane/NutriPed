import { createContext, ReactNode, useState } from "react";
import { useDatabase } from "./DatabaseContext";
import React from "react";
import { View } from "@/components/ui/view";
import { Text } from "@/components/ui/text";
import { useEventBus } from "domain-eventrix/react";
import {
  PediatricAppProvider as AdapterPediatricAppProvider,
  IndexedDBConnection,
} from "@/adapter";

import { IEventBus } from "@/core/shared";

export interface IPediatricAppContext {}

export const PediatricAppContext = createContext<IPediatricAppContext>({});

export interface PediatricAppProviderType {
  children: ReactNode;
}

export const PediatricAppProvider: React.FC<PediatricAppProviderType> = ({
  children,
}) => {
  const eventBus = useEventBus();
  const { db, dbOpened } = useDatabase();

  if (!dbOpened)
    return (
      <View>
        <Text>DataBase Not Opened</Text>
      </View>
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
