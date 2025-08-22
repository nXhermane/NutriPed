import { CreateIndicatorProps, Indicator } from "@/core/evaluation";
import {
  formatError,
  InfraMapToDomainError,
  InfrastructureMapper,
} from "@shared";
import { IndicatorPersistenceDto } from "../dtos";

export class IndicatorInfraMapper
  implements InfrastructureMapper<Indicator, IndicatorPersistenceDto>
{
  toPersistence(entity: Indicator): IndicatorPersistenceDto {
    return {
      id: entity.id as string,
      code: entity.getCode(),
      name: entity.getName(),
      availableRefCharts: entity.getAvailableCharts().map(availableChart => ({
        chartCode: availableChart.chartCode.unpack(),
        condition: availableChart.condition.unpack(),
      })),
      availableRefTables: entity.getAvailableTables().map(availableTable => ({
        condition: availableTable.condition.unpack(),
        tableCode: availableTable.tableCode.unpack(),
      })),
      axeX: entity.getAxeX(),
      axeY: entity.getAxeY(),
      interpretations: entity.getInterpretations().map(interpretation => ({
        code: interpretation.code.unpack(),
        condition: interpretation.condition.unpack(),
        name: interpretation.name,
        range: interpretation.range,
      })),
      neededMeasureCodes: entity.getMeasureCodes(),
      standardShape: entity.getStandardShape(),
      usageConditions: entity.getUsageCondition(),
      zScoreComputingStrategy: entity.getZScoreComputingStrategyType(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
  toDomain(record: IndicatorPersistenceDto): Indicator {
    const indicatorRes = Indicator.create(
      record as CreateIndicatorProps,
      record.id
    );
    if (indicatorRes.isFailure)
      throw new InfraMapToDomainError(
        formatError(indicatorRes, IndicatorInfraMapper.name)
      );

    const { createdAt, updatedAt, id, ...props } = indicatorRes.val.getProps();
    return new Indicator({
      id,
      props,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
