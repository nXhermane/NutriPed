import { OrientationReference } from "../../../../domain/modules/next/orientation/models";
import { OrientationReferenceDto } from "../../dtos/next/orientation";

export class OrientationReferenceMapper {
  static toDto(
    orientationReference: OrientationReference
  ): OrientationReferenceDto {
    return {
      id: orientationReference.getId(),
      name: orientationReference.getName(),
      code: orientationReference.getCode(),
      criteria: orientationReference.getCriteria(),
      treatmentPhase: orientationReference.getTreatmentPhase(),
      createdAt: orientationReference.getCreatedAt().toISOString(),
      updatedAt: orientationReference.getUpdatedAt().toISOString(),
    };
  }
}
