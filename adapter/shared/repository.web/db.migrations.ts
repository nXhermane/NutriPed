import { createStoreIndexes } from "../../shared/repository.web/db.config";

export interface Migration {
   version: number;
   up: (db: IDBDatabase) => void;
}

export const migrations: Migration[] = [
   {
      version: 1,
      up: (db: IDBDatabase) => {
         createStoreIndexes(db);
      }
   }
   // Futures migrations...
];