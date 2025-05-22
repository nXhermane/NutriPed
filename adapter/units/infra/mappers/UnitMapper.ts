import { Unit } from "@core/units";
import {
  formatError,
  InfraMapToDomainError,
  InfrastructureMapper,
} from "@shared";
import { UnitPersistenceDto } from "../dtos";

export class UnitInfraMapper
  implements InfrastructureMapper<Unit, UnitPersistenceDto>
{
  toPersistence(entity: Unit): UnitPersistenceDto {
    return {
      id: entity.id as string,
      baseUnitCode: entity.getBaseUnit(),
      code: entity.getCode(),
      conversionFactor: entity.getFactor(),
      name: entity.getName(),
      type: entity.getType(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
  toDomain(record: UnitPersistenceDto): Unit {
    const unitRes = Unit.create(record, record.id);
    if (unitRes.isFailure)
      throw new InfraMapToDomainError(
        formatError(unitRes, UnitInfraMapper.name)
      );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, updatedAt, createdAt, ...props } = unitRes.val.getProps();
    return new Unit({
      id,
      updatedAt: record.updatedAt,
      createdAt: record.createdAt,
      props,
    });
  }
}
