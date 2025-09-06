import { ApplicationMapper } from "@/core/shared";
import { CareMessageDto } from "../dtos";
import { Message } from "../../domain/next/core/models/entities";

export class CareMessageMapper implements ApplicationMapper<Message, CareMessageDto> {
  toResponse(entity: Message): CareMessageDto {
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
