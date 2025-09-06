import { ApplicationMapper } from "@/core/shared";
import { MonitoringParameterDto } from "../dtos";
import { MonitoringParameter } from "../../domain/next/core/models/entities";

export class MonitoringParameterMapper implements ApplicationMapper<MonitoringParameter, MonitoringParameterDto> {
  toResponse(entity: MonitoringParameter): MonitoringParameterDto {
    const element = entity.getElement();
    return {
      id: entity.id,
      startDate: entity.getStartDate(),
      endDate: entity.getEndDate(),
      nextTaskDate: entity.getNextTaskDate(),
      lastExecutionDate: entity.getLastExecutionDate(),
      element: {
        id: element.id,
        category: element.category,
        source: element.source,
        code: element.code,
        frequency: element.frequency,
        duration: element.duration,
      },
      createdAt: entity.createdAt.toString(),
      updatedAt: entity.updatedAt.toString(),
    };
  }
}
