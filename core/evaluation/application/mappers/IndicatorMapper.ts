import { ApplicationMapper } from "@shared";
import { Indicator } from "../../domain";
import { IndicatorDto } from "../dtos";

export class IndicatorMapper
  implements ApplicationMapper<Indicator, IndicatorDto>
{
  toResponse(entity: Indicator): IndicatorDto {
    return {
      id: entity.id,
      axeX: entity.getAxeX(),
      axeY: entity.getAxeY(),
      code: entity.getCode(),
      name: entity.getName(),
      neededMeasureCodes: entity.getMeasureCodes(),
      usageConditions: entity.getUsageCondition(),
      zScoreComputingStrategy: entity.getZScoreComputingStrategyType(),
      standardShape: entity.getStandardShape(),
      interpretations: entity.getInterpretations().map(interpretation => ({
        code: interpretation.code.unpack(),
        condition: interpretation.condition.unpack(),
        name: interpretation.name,
        range: interpretation.range,
      })),
      availableRefCharts: entity.getAvailableCharts().map(availableChart => ({
        chartCode: availableChart.chartCode.unpack(),
        condition: availableChart.condition.unpack(),
      })),
      availableRefTables: entity.getAvailableTables().map(availableTable => ({
        tableCode: availableTable.tableCode.unpack(),
        condition: availableTable.condition.unpack(),
      })),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
