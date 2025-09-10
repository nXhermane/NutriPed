import { AggregateID } from "@/core/shared";
import { NextCore } from "@/core/nutrition_care/domain";

export interface UserResponseSummaryPersistenceDto {
  messageId: AggregateID;
  response: string;
  timestamp: string;
  decisionData: NextCore.UserDecisionData;
}
