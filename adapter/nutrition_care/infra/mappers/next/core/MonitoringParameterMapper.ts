import { InfrastructureMapper } from "@/core/shared";
import {
  MonitoringParameter,
  CreateMonitoringParameter,
} from "@/core/nutrition_care/domain/next/core/models/entities";
import { MonitoringParameterPersistenceDto } from "../../../dtos/next/core";

export class MonitoringParameterInfraMapper
  implements
    InfrastructureMapper<MonitoringParameter, MonitoringParameterPersistenceDto>
{
  toPersistence(
    entity: MonitoringParameter
  ): MonitoringParameterPersistenceDto {
    const { element } = entity.getProps();
    return {
      id: entity.id as string,
      startDate: entity.getStartDate(),
      endDate: entity.getEndDate() || null,
      nextTaskDate: entity.getNextTaskDate() || null,
      lastExecutionDate: entity.getLastExecutionDate() || null,
      element: {
        category: element.getCategory(),
        code: element.getCode(),
        duration: element.getDuration(),
        frequency: element.getFrequency(),
        id: element.getId(),
        source: element.getSource(),
      },
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toDomain(record: MonitoringParameterPersistenceDto): MonitoringParameter {
    const createProps: CreateMonitoringParameter = {
      startDate: record.startDate,
      endDate: record.endDate,
      nextTaskDate: record.nextTaskDate,
      lastExecutionDate: record.lastExecutionDate,
      element: record.element,
    };

    const result = MonitoringParameter.create(createProps, record.id);
    if (result.isFailure) {
      throw new Error(
        `Failed to create MonitoringParameter from persistence data: ${result.err}`
      );
    }

    return result.val;
  }
}
