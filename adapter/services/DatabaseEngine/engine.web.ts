import { DB_CONFIG, IndexedDBConnection, createStoreIndexes } from "../../shared";
import { DatabaseEngine } from "./IDatabaseEngine";

export default class WebDatabaseEngine implements DatabaseEngine {
  private dbInstance: IndexedDBConnection | null = null;

  async init(): Promise<void> {
    this.dbInstance = new IndexedDBConnection(
      DB_CONFIG.name,
      DB_CONFIG.version,
      (db: IDBDatabase) => createStoreIndexes(db)
    );
  }

  getDb(): IndexedDBConnection | null {
    return this.dbInstance;
  }

  async open(): Promise<void> {
    await this.dbInstance?.open();
  }
  async close(): Promise<void> {
    this.dbInstance?.close();
  }
  async delete(): Promise<void> {
    this.dbInstance?.delete();
  }
}
