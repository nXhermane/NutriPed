import { CreateGrowthReferenceTableProps, GrowthReferenceTable } from "@core/diagnostics";
import { formatError, InfraMapToDomainError, InfrastructureMapper } from "@shared";
import { GrowthReferenceTablePersistenceDto } from "../dtos";

export class GrowthReferenceTableInfraMapper implements InfrastructureMapper<GrowthReferenceTable, GrowthReferenceTablePersistenceDto> {
   toPersistence(entity: GrowthReferenceTable): GrowthReferenceTablePersistenceDto {
      return {
         id: entity.id as string,
         code: entity.getCode(),
         name: entity.getName(),
         standard: entity.getStandard(),
         data: entity.getTableData(),
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
   toDomain(record: GrowthReferenceTablePersistenceDto): GrowthReferenceTable {
      const growthRefTableRes = GrowthReferenceTable.create(record as CreateGrowthReferenceTableProps, record.id);
      if (growthRefTableRes.isFailure) throw new InfraMapToDomainError(formatError(growthRefTableRes, GrowthReferenceTableInfraMapper.name));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { createdAt, updatedAt, id, ...props } = growthRefTableRes.val.getProps();
      return new GrowthReferenceTable({
         id,
         createdAt: record.createdAt,
         updatedAt: record.updatedAt,
         props,
      });
   }
}
