import {
  UserResponse,
  CreateUserRespone,
} from "@/core/nutrition_care/domain/next/core/models/valueObjects";
import { UserResponseSummaryPersistenceDto } from "../../../dtos/next/core";

export class UserResponseSummaryInfraMapper {
  toPersistence(entity: UserResponse): UserResponseSummaryPersistenceDto {
    return {
      messageId: entity.getMessageId(),
      response: entity.getResponse(),
      timestamp: entity.getTimestamp(),
      decisionData: entity.getDecisionData(),
    };
  }

  toDomain(record: UserResponseSummaryPersistenceDto): UserResponse {
    const createProps: CreateUserRespone = {
      messageId: record.messageId,
      response: record.response,
      timestamp: record.timestamp,
      decisionData: record.decisionData,
    };

    const result = UserResponse.create(createProps);
    if (result.isFailure) {
      throw new Error(
        `Failed to create UserResponse from persistence data: ${result.err}`
      );
    }

    return result.val;
  }
}
