
import { NextCore } from "@/core/nutrition_care/domain";
import { AggregateID } from "@/core/shared";

export interface UserResponseSummaryDto {
  messageId: AggregateID;
  response: string;
  timestamp: string;
  decisionData: NextCore.UserDecisionData
}
