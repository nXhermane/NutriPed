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
    },
  },
  {
    version: 3,
    up: (db: IDBDatabase) => {
      createStoreIndexes(db);
    },
  },
  {
    version: 4,
    up: (db: IDBDatabase) => {
      // More precise migration as suggested by reviewer
      if (!db.objectStoreNames.contains("next_orientation_references")) {
        db.createObjectStore("next_orientation_references", { keyPath: "id" });
      }
    },
  },
  // Futures migrations...
];
