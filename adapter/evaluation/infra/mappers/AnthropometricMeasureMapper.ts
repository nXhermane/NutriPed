import { InfrastructureMapper } from "@shared";
import { AnthropometricMeasurePersistenceDto } from "../dtos";
import { AnthropometricMeasure } from "@/core/evaluation";

export class AnthropometricMeasureInfraMapper
  implements
    InfrastructureMapper<
      AnthropometricMeasure,
      AnthropometricMeasurePersistenceDto
    >
{
  toPersistence(
    entity: AnthropometricMeasure
  ): AnthropometricMeasurePersistenceDto {
    return {
      id: entity.id as string,
      code: entity.getCode(),
      name: entity.getName(),
      availableUnit: entity.getUnits().availableUnits,
      unit: entity.getUnits().defaultUnit,
      validationRules: entity.getValidationRules(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
  toDomain(record: AnthropometricMeasurePersistenceDto): AnthropometricMeasure {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, updatedAt, id, ...otherProps } =
      AnthropometricMeasure.create(record, record.id).val.getProps();
    return new AnthropometricMeasure({
      id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: { ...otherProps },
    });
  }
}
