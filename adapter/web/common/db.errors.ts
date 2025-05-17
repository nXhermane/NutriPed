import { ExceptionBase } from "@shared";

export class DatabaseConnectionError extends ExceptionBase {
   code = 'DB_CONNECTION_ERROR';
   constructor(message: string, cause?: Error) {
      super(message, cause);
   }
}

export class DatabaseMigrationError extends ExceptionBase {
   code = 'DB_MIGRATION_ERROR';
   constructor(message: string, cause?: Error) {
      super(message, cause);
   }
}