import { ApplicationMapper } from "@/core/shared";
import { MessageDto } from "../dtos/next/core";
import { NextCore } from "../../domain";

export class MessageMapper implements ApplicationMapper<NextCore.Message, MessageDto> {
  toResponse(entity: NextCore.Message): MessageDto {
    return {
      id: entity.id,
      type: entity.getType(),
      content: entity.getContent(),
      timestamp: entity.getTimeStamp(),
      requiresResponse: entity.getRequiresResponse(),
      decisionType: entity.getDecisionType(),
      createdAt: entity.createdAt.toString(),
      updatedAt: entity.updatedAt.toString(),
    };
  }
}
