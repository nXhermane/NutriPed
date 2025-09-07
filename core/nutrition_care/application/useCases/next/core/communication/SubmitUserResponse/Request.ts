import { NextCore } from "@/core/nutrition_care/domain";
import { AggregateID } from "@shared";

export type SubmitUserResponseRequest = {
  sessionId: AggregateID;
  messageId: AggregateID;
  response: string;
  decisionData?: NextCore.UserDecisionData;
};
