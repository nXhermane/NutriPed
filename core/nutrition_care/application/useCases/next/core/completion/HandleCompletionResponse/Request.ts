import { AggregateID } from "@shared";

export type HandleCompletionResponseRequest = {
  sessionId: AggregateID;
  messageId: AggregateID;
  response: string;
  decisionData?: Record<string, any>;
};
