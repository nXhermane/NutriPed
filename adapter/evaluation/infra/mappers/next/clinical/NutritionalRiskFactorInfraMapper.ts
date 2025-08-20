import { NextClinicalDomain } from "@/core/evaluation";
import {
  formatError,
  InfraMapToDomainError,
  InfrastructureMapper,
} from "@/core/shared";
import { NextClinicalInfraDtos } from "../../../dtos";

export class NutritionalRiskFactorInfraMapper
  implements
    InfrastructureMapper<
      NextClinicalDomain.NutritionalRiskFactor,
      NextClinicalInfraDtos.NutritionalRiskFactorPersistenceDto
    >
{
  toPersistence(
    entity: NextClinicalDomain.NutritionalRiskFactor
  ): NextClinicalInfraDtos.NutritionalRiskFactorPersistenceDto {
    return {
      id: entity.id,
      associatedNutrients: entity.getAssociatedNutrients(),
      clinicalSignCode: entity.getClinicalSignCode(),
      createdAt: entity.createdAt,
      modulatingCondition: entity.getModulatingCondition(),
      recommendedTests: entity.getRecommendedTests(),
      updatedAt: entity.updatedAt,
    };
  }
  toDomain(
    record: NextClinicalInfraDtos.NutritionalRiskFactorPersistenceDto
  ): NextClinicalDomain.NutritionalRiskFactor {
    const nutritionalRiskFactorRes =
      NextClinicalDomain.NutritionalRiskFactor.create(record, record.id);
    if (nutritionalRiskFactorRes.isFailure)
      throw new InfraMapToDomainError(
        formatError(
          nutritionalRiskFactorRes,
          NutritionalRiskFactorInfraMapper.name
        )
      );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, updatedAt, ...props } =
      nutritionalRiskFactorRes.val.getProps();
    return new NextClinicalDomain.NutritionalRiskFactor({
      id,
      props,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
