import { ApplicationMapper } from "@shared";
import { Unit } from "../../domain";
import { UnitDto } from "../dtos";

export class UnitMapper implements ApplicationMapper<Unit, UnitDto> {
   toResponse(entity: Unit): UnitDto {
      return {
         id: entity.id,
         name: entity.getName(),
         code: entity.getCode(),
         baseUnitCode: entity.getBaseUnit(),
         conversionFactor: entity.getFactor(),
         type: entity.getType(),
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
}
