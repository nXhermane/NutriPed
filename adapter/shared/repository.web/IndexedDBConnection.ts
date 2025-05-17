export class IndexedDBConnection {
   private dbName: string;
   private dbVersion: number;
   private db: IDBDatabase | null;
   private onUpgrade: (db: IDBDatabase) => void;

   constructor(dbName: string, dbVersion: number, onUpgrade: (db: IDBDatabase) => void = () => {}) {
      this.dbName = dbName;
      this.dbVersion = dbVersion;
      this.db = null;
      this.onUpgrade = onUpgrade;
   }

   open(): Promise<IDBDatabase> {
      return new Promise((resolve, reject) => {
         const request = indexedDB.open(this.dbName, this.dbVersion);

         request.onsuccess = (event) => {
            this.db = (event.target as IDBOpenDBRequest).result;
            resolve(this.db);
         };

         request.onerror = (event) => {
            reject((event.target as IDBOpenDBRequest).error);
         };

         request.onupgradeneeded = (event) => {
            this.db = (event.target as IDBOpenDBRequest).result;
            this.onUpgrade(this.db);
         };
      });
   }

   close(): void {
      if (this.db) {
         this.db.close();
         this.db = null;
      }
   }
   delete() {
      indexedDB.deleteDatabase(this.dbName);
   }
}
