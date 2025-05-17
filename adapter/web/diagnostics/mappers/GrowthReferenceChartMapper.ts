import { CreateGrowthReferenceChartProps, GrowthReferenceChart } from "@core/diagnostics";
import { formatError, InfraMapToDomainError, InfrastructureMapper } from "@shared";
import { GrowthReferenceChartPersistenceDto } from "../persistenceDto";

export class GrowthReferenceChartInfraMapper implements InfrastructureMapper<GrowthReferenceChart, GrowthReferenceChartPersistenceDto> {
   toPersistence(entity: GrowthReferenceChart): GrowthReferenceChartPersistenceDto {
      return {
         id: entity.id as string,
         code: entity.getCode(),
         name: entity.getName(),
         sex: entity.getSex(),
         standard: entity.getStandard(),
         data: entity.getChartData(),
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
   toDomain(record: GrowthReferenceChartPersistenceDto): GrowthReferenceChart {
      const growthReferenceChartRes = GrowthReferenceChart.create(record as CreateGrowthReferenceChartProps, record.id);
      if (growthReferenceChartRes.isFailure)
         throw new InfraMapToDomainError(formatError(growthReferenceChartRes, GrowthReferenceChartInfraMapper.name));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { createdAt, updatedAt, id, ...otherProps } = growthReferenceChartRes.val.getProps();
      return new GrowthReferenceChart({ id, createdAt: record.createdAt, updatedAt: record.updatedAt, props: { ...otherProps } });
   }
}
