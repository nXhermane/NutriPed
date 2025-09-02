import { OrientationReference } from "@/core/nutrition_care/domain/modules/next/orientation/models";
import { CreateCriterion, Result } from "@/core/shared";
import { OrientationPersistenceDto } from "../../dtos/next/orientation";

export class OrientationInfraMapper {
  static toPersistence(
    domainEntity: OrientationReference
  ): OrientationPersistenceDto {
    return {
      id: domainEntity.getId(),
      name: domainEntity.getName(),
      code: domainEntity.getCode(),
      criteria: domainEntity.getCriteria(),
      treatmentPhase: domainEntity.getTreatmentPhase(),
      createdAt: domainEntity.getCreatedAt().toISOString(),
      updatedAt: domainEntity.getUpdatedAt().toISOString(),
    };
  }

  static toDomain(
    persistenceDto: OrientationPersistenceDto
  ): Result<OrientationReference> {
    const createCriteria: CreateCriterion[] = persistenceDto.criteria.map(
      (c) => ({
        condition: c.condition.value,
        variablesExplanation: c.variablesExplanation,
      })
    );

    return OrientationReference.create(
      {
        name: persistenceDto.name,
        code: persistenceDto.code,
        criteria: createCriteria,
        treatmentPhase: persistenceDto.treatmentPhase,
      },
      persistenceDto.id
    );
  }
}
