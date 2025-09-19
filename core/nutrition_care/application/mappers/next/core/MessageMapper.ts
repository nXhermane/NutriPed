import { ApplicationMapper } from "@shared";
import { MessageDto } from "../../../dtos/next/core";
import { NextCore } from "@/core/nutrition_care/domain";

/**
 * Mapper pour les messages utilisateur
 * Convertit les entités domaine vers les DTOs d'application
 */
export class MessageMapper
  implements ApplicationMapper<NextCore.Message, MessageDto>
{
  /**
   * Convertit une entité Message vers un DTO
   * @param entity Interface Message du domaine
   */
  toResponse(entity: NextCore.Message): MessageDto {
    return {
      id: entity.id,
      type: entity.getType(),
      content: entity.getContent(),
      timestamp: entity.getTimeStamp(),
      requiresResponse: entity.getRequiresResponse(),
      decisionType: entity.getDecisionType(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
