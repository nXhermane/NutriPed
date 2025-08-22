import { Complication } from "@core/nutrition_care";
import {
  formatError,
  InfraMapToDomainError,
  InfrastructureMapper,
} from "@shared";
import { ComplicationPersistenceDto } from "../dtos";

export class ComplicationInfraMapper
  implements InfrastructureMapper<Complication, ComplicationPersistenceDto>
{
  toPersistence(entity: Complication): ComplicationPersistenceDto {
    return {
      id: entity.id as string,
      code: entity.getCode(),
      name: entity.getName(),
      description: entity.getDescription(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
  toDomain(record: ComplicationPersistenceDto): Complication {
    const complicationRes = Complication.create(record, record.id);
    if (complicationRes.isFailure)
      throw new InfraMapToDomainError(
        formatError(complicationRes, ComplicationInfraMapper.name)
      );

    const { id, createdAt, updatedAt, ...props } =
      complicationRes.val.getProps();
    return new Complication({
      id,
      props,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
