import { EntityPersistenceDto } from "@/adapter/shared";
import { NextCore } from "@/core/nutrition_care/domain";

export interface MessagePersistenceDto extends EntityPersistenceDto {
  type: NextCore.MessageType;
  content: string;
  timestamp: string;
  requiresResponse: boolean;
  decisionType?: NextCore.DecisionType;
}
