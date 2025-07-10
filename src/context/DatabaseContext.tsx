import { IndexedDBConnection } from "@/adapter";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import DataBaseEngine from "@services/DatabaseEngine/engine";
export interface DatabaseContextType {
  db: any | IndexedDBConnection | null;
  dbOpened: boolean;
}

export const DatabaseContext = createContext<DatabaseContextType>({
  db: null,
  dbOpened: false,
});

export interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({
  children,
}) => {
  const [dbOpened, setDbOpened] = useState(false);
  const [db, setDb] = useState<any | IndexedDBConnection | null>(null);
  const engine = new DataBaseEngine();

  useEffect(() => {
    async function initDb() {
      try {
        await engine.init();
        await engine.open();
        if (engine.getDb() != null) {
          setDb(engine.getDb() as any | IndexedDBConnection | null);
          setDbOpened(true);
        }
      } catch (e: unknown) {
        console.error(
          "Error in Db Initialization",
          `[${DatabaseProvider.name}]:`,
          e
        );
      }
    }
    initDb();

    return () => {
      engine.close();
      setDbOpened(false);
      setDb(null);
    };
  }, []);
  return (
    <DatabaseContext.Provider
      value={{
        db: db,
        dbOpened,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
};
