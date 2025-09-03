import { ApplicationMapper } from "@shared";
import { OrientationReference } from "../../../domain/modules/next/orientation";
import { OrientationReferenceDto } from "../../dtos/next/orientation";

export class OrientationReferenceMapper
  implements ApplicationMapper<OrientationReference, OrientationReferenceDto>
{
  toResponse(entity: OrientationReference): OrientationReferenceDto {
    return {
      id: entity.id,
      name: entity.getName(),
      code: entity.getCode(),
      criteria: entity.getCriteria(),
      treatmentPhase: entity.getTreatmentPhase(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
