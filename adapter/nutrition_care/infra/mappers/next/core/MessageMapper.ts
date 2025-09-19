import { InfrastructureMapper } from "@/core/shared";
import {
  Message,
  CreateMessage,
} from "@/core/nutrition_care/domain/next/core/models/entities";
import { MessagePersistenceDto } from "../../../dtos/next/core";

export class MessageInfraMapper
  implements InfrastructureMapper<Message, MessagePersistenceDto>
{
  toPersistence(entity: Message): MessagePersistenceDto {
    return {
      id: entity.id as string,
      type: entity.getType(),
      content: entity.getContent(),
      timestamp: entity.getTimeStamp(),
      requiresResponse: entity.getRequiresResponse(),
      decisionType: entity.getDecisionType() || undefined,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toDomain(record: MessagePersistenceDto): Message {
    const createProps: CreateMessage = {
      type: record.type,
      content: record.content,
      timestamp: record.timestamp,
      requiresResponse: record.requiresResponse,
      decisionType: record.decisionType,
    };

    const result = Message.create(createProps, record.id);
    if (result.isFailure) {
      throw new Error(
        `Failed to create Message from persistence data: ${result.err}`
      );
    }

    return result.val;
  }
}
