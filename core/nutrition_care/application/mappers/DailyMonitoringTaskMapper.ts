import { ApplicationMapper } from "@/core/shared";
import { DailyMonitoringTaskDto } from "../dtos";
import { DailyMonitoringTask } from "../../domain/next/core/models/entities";

export class DailyMonitoringTaskMapper
  implements ApplicationMapper<DailyMonitoringTask, DailyMonitoringTaskDto>
{
  toResponse(entity: DailyMonitoringTask): DailyMonitoringTaskDto {
    return {
      id: entity.id,
      monitoringId: entity.getMonitoringId(),
      status: entity.getStatus(),
      task: entity.getTask(),
      effectiveDate: entity.getProps().effectiveDate.toString(),
      createdAt: entity.createdAt.toString(),
      updatedAt: entity.updatedAt.toString(),
    };
  }
}
