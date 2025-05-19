export interface DatabaseEngine {
  init(): Promise<void>;
  getDb(): unknown;
  open(): Promise<void>;
  close(): Promise<void>;
  delete(): Promise<void>;
}
