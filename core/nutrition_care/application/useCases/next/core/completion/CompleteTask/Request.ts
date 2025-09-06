import { AggregateID } from "@shared";

export type CompleteTaskRequest = {
  sessionId: AggregateID;
  taskId: AggregateID;
};
