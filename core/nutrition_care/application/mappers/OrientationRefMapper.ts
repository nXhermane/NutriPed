import { ApplicationMapper } from "@shared";
import { OrientationReference } from "../../domain";
import { OrientationRefDto } from "../dtos";

export class OrientationRefMapper implements ApplicationMapper<OrientationReference, OrientationRefDto> {
   toResponse(entity: OrientationReference): OrientationRefDto {
      return {
         id: entity.id,
         name: entity.getName(),
         admissionCriteria: entity.getAdmissionCriteria(),
         admissionTypes: entity
            .getAdmissionTypes()
            .map((valObj) => ({ code: valObj.code.unpack(), condition: valObj.condition.unpack(), name: valObj.name })),
         code: entity.getCode(),
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
}
