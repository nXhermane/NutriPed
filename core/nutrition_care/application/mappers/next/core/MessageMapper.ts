import { ApplicationMapper } from "@shared";
import { MessageDto, UserResponseDto } from "../../../dtos/next/core/PatientCareSessionDto";

/**
 * Mapper pour les messages utilisateur
 * Convertit les entités domaine vers les DTOs d'application
 *
 * Note: Utilise `any` car Message est une interface simple, pas une Entity complète
 */
export class MessageMapper
  implements ApplicationMapper<any, MessageDto>
{
  /**
   * Convertit une entité Message vers un DTO
   * @param entity Interface Message du domaine
   */
  toResponse(entity: any): MessageDto {
    return {
      id: entity.id,
      type: entity.type,
      content: entity.content,
      timestamp: entity.timestamp.toString(),
      requiresResponse: entity.requiresResponse,
      decisionType: entity.decisionType
    };
  }
}

/**
 * Mapper pour les réponses utilisateur
 * Convertit les entités domaine vers les DTOs d'application
 *
 * Note: Utilise `any` car UserResponse est une interface simple, pas une Entity complète
 */
export class UserResponseMapper
  implements ApplicationMapper<any, UserResponseDto>
{
  /**
   * Convertit une entité UserResponse vers un DTO
   * @param entity Interface UserResponse du domaine
   */
  toResponse(entity: any): UserResponseDto {
    return {
      messageId: entity.messageId,
      response: entity.response,
      timestamp: entity.timestamp.toString(),
      decisionData: entity.decisionData
    };
  }
}
