import { ApplicationMapper } from "@shared";
import { CarePhase } from "../../domain";
import { CarePhaseDto } from "../dtos";

export class CarePhaseMapper implements ApplicationMapper<CarePhase, CarePhaseDto> {
   toResponse(entity: CarePhase): CarePhaseDto {
      return {
         name: entity.getProps().name,
         id: entity.id,
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
}
