import { NextCore } from "@/core/nutrition_care/domain";
import { AggregateID } from "@/core/shared";

export interface MessageDto {
    id: AggregateID;
    type: NextCore.MessageType;
    content: string;
    timestamp: string;
    requiresResponse: boolean;
    decisionType?: NextCore.DecisionType;
    createdAt: string;
    updatedAt: string;
}