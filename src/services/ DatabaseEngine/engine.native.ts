import migrations from "@/drizzle/migrations";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import { DatabaseEngine } from "./IDatabaseEngine";
import { openDatabaseSync, SQLiteDatabase } from "expo-sqlite";

export default class NativeDatabaseEngine implements DatabaseEngine {
  private expoDb: SQLiteDatabase | null = null;

  async init(): Promise<void> {
    this.expoDb = openDatabaseSync("nutrition_app.db");
    const db = drizzle(this.expoDb);
    await migrate(db, migrations);
  }
  getDb() {
    return this.expoDb;
  }
  async open(): Promise<void> {
    //Nothing to do
  }
  async close(): Promise<void> {
    //Nothing to do
  }
  async delete(): Promise<void> {
    // Nothing to do
  }
}
