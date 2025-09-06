import { AggregateID } from "@shared";

export type SubmitUserResponseRequest = {
  sessionId: AggregateID;
  messageId: AggregateID;
  response: string;
  decisionData?: Record<string, any>;
};
