import { UserDecisionData } from "@/core/nutrition_care/domain/next";
import { AggregateID } from "@/core/shared";

export interface UserResponseSummaryDto {
  messageId: AggregateID;
  response: string;
  timestamp: string;
  decisionData: UserDecisionData
}
