import { Complication } from "@core/nutrition_care";
import { formatError, InfraMapToDomainError, InfrastructureMapper } from "@shared";
import { ComplicationPersistenceDto } from "../mappers";

export class ComplicationInfraMapper implements InfrastructureMapper<Complication, ComplicationPersistenceDto> {
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
      if (complicationRes.isFailure) throw new InfraMapToDomainError(formatError(complicationRes, ComplicationInfraMapper.name));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, createdAt, updatedAt, ...props } = complicationRes.val.getProps();
      return new Complication({ id, props, createdAt: record.createdAt, updatedAt: record.updatedAt });
   }
}
