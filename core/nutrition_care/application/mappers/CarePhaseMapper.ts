import { ApplicationMapper } from "@/core/shared";
import { CarePhase } from "../../domain";
import { CarePhaseDto } from "../dtos/core";

export class CarePhaseMapper
  implements ApplicationMapper<CarePhase, CarePhaseDto>
{
  toResponse(entity: CarePhase): CarePhaseDto {
    return {
      id: entity.id,
      name: entity.getProps().name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
