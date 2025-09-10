import { NextNutritionCare } from "@/core/nutrition_care";
import {
  formatError,
  InfraMapToDomainError,
  InfrastructureMapper,
} from "@/core/shared";
import { OrientationReferencePersistenceDto } from "../../../dtos/next/orientation";

export class OrientationReferenceInfraMapper
  implements
    InfrastructureMapper<
      NextNutritionCare.OrientationReference,
      OrientationReferencePersistenceDto
    >
{
  toPersistence(
    entity: NextNutritionCare.OrientationReference
  ): OrientationReferencePersistenceDto {
    return {
      id: entity.id,
      name: entity.getName(),
      code: entity.getCode(),
      criteria: entity.getCriteria().map(criterion => ({
        condition: criterion.condition.unpack(),
        description: criterion.description,
        variablesExplanation: criterion.variablesExplanation,
      })),
      treatmentPhase: entity.getTreatmentPhase(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toDomain(
    record: OrientationReferencePersistenceDto
  ): NextNutritionCare.OrientationReference {
    const orientationRes = NextNutritionCare.OrientationReference.create(
      record as NextNutritionCare.CreateOrientationReference,
      record.id
    );

    if (orientationRes.isFailure) {
      throw new InfraMapToDomainError(
        formatError(orientationRes, NextNutritionCare.OrientationReference.name)
      );
    }
    const { id, createdAt, updatedAt, ...props } =
      orientationRes.val.getProps();
    return new NextNutritionCare.OrientationReference({
      id,
      createdAt,
      updatedAt,
      props,
    });
  }
}
