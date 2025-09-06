import { AggregateID } from "@/core/shared";
import { MessageType, DecisionType } from "@/core/nutrition_care/domain/next/core/models/entities";

export interface CareMessageDto {
  id: AggregateID;
  type: MessageType;
  content: string;
  timestamp: string;
  requiresResponse: boolean;
  decisionType?: DecisionType;
  createdAt: string;
  updatedAt: string;
}
