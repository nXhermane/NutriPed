import { ApplicationMapper } from "@shared";
import { CarePhase } from "../../../../domain/next/core/models/entities/CarePhase";
import { CarePhaseDto } from "../../../dtos/next/core/PatientCareSessionDto";

/**
 * Mapper pour les phases de soin
 * Convertit les entités domaine vers les DTOs d'application
 */
export class CarePhaseMapper
  implements ApplicationMapper<CarePhase, CarePhaseDto>
{
  /**
   * Convertit une entité CarePhase vers un DTO
   * @param entity Entité CarePhase du domaine
   */
  toResponse(entity: CarePhase): CarePhaseDto {
    return {
      id: entity.id,
      code: entity.getCode(),
      name: this.getPhaseName(entity.getCode()),
      status: entity.getStatus(),
      startDate: entity.getStartDate(),
      endDate: entity.getEndDate()
    };
  }

  /**
   * Détermine le nom de la phase à partir de son code
   */
  private getPhaseName(code: string): string {
    const phaseNames: Record<string, string> = {
      "INIT": "Phase d'initialisation",
      "STABILIZATION": "Phase de stabilisation",
      "MAINTENANCE": "Phase de maintenance",
      "RECOVERY": "Phase de récupération",
      "TRANSITION": "Phase de transition"
    };
    return phaseNames[code] || `Phase ${code}`;
  }
}
