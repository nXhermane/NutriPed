import { DatabaseEngine } from "./IDatabaseEngine";

export default class Engine implements DatabaseEngine {
  open(): Promise<void> {
    throw new Error("Not Supported Platform.");
  }
  close(): Promise<void> {
    throw new Error("Not Supported Platform.");
  }
  delete(): Promise<void> {
    throw new Error("Not Supported Platform.");
  }
  init(): Promise<void> {
    throw new Error("Not Supported Platform.");
  }
  getDb(): unknown {
    throw new Error("Not Supported Platform.");
  }
}
