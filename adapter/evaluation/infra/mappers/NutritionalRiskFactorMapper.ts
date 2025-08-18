import { NutritionalRiskFactor } from "@/core/evaluation";
import {
  formatError,
  InfraMapToDomainError,
  InfrastructureMapper,
} from "@shared";
import { NutritionalRiskFactorPersistenceDto } from "../dtos";

export class NutritionalRiskFactorInfraMapper
  implements
    InfrastructureMapper<
      NutritionalRiskFactor,
      NutritionalRiskFactorPersistenceDto
    >
{
  toPersistence(
    entity: NutritionalRiskFactor
  ): NutritionalRiskFactorPersistenceDto {
    return {
      id: entity.id as string,
      associatedNutrients: entity.getAssociatedNutrients().map(nutrient => ({
        nutrient: nutrient.nutrient.unpack(),
        effect: nutrient.effect,
      })),
      clinicalSignCode: entity.getClinicalSignCode(),
      modulatingCondition: entity.getModulatingCondition(),
      recommendedTests: entity.getRecommendedTests(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
  toDomain(record: NutritionalRiskFactorPersistenceDto): NutritionalRiskFactor {
    const nutritionalRiskFactorRes = NutritionalRiskFactor.create(
      record,
      record.id
    );
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
    return new NutritionalRiskFactor({
      id,
      props,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
