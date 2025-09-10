import { AggregateID } from "@shared";

export type CompleteActionRequest = {
  sessionId: AggregateID;
  actionId: AggregateID;
};
