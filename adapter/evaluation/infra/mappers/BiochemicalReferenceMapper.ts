import { BiochemicalReference } from "@/core/evaluation";
import {
  formatError,
  InfraMapToDomainError,
  InfrastructureMapper,
} from "@shared";
import { BiochemicalReferencePersistenceDto } from "../dtos";

export class BiochemicalReferenceInfraMapper
  implements
    InfrastructureMapper<
      BiochemicalReference,
      BiochemicalReferencePersistenceDto
    >
{
  toPersistence(
    entity: BiochemicalReference
  ): BiochemicalReferencePersistenceDto {
    return {
      id: entity.id as string,
      code: entity.getCode(),
      name: entity.getName(),
      availableUnits: entity.getUnits().availableUnits,
      unit: entity.getUnits().defaultUnit,
      ranges: entity.getRanges().map(range => ({
        condition: range.condition.unpack(),
        over: range.over,
        under: range.under,
        range: range.range,
      })),
      notes: entity.getNotes(),
      source: entity.getSource(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
  toDomain(record: BiochemicalReferencePersistenceDto): BiochemicalReference {
    const biochemicalRefRes = BiochemicalReference.create(record, record.id);
    if (biochemicalRefRes.isFailure)
      throw new InfraMapToDomainError(
        formatError(biochemicalRefRes, BiochemicalReferenceInfraMapper.name)
      );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, updatedAt, id, ...props } =
      biochemicalRefRes.val.getProps();
    return new BiochemicalReference({
      id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props,
    });
  }
}
