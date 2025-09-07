import { InfrastructureMapper } from "@/core/shared";
import {
  DailyMonitoringTask,
  CreateDailyMonitoringTask,
} from "@/core/nutrition_care/domain/next/core/models/entities";
import { DailyMonitoringTaskPersistenceDto } from "../../../dtos/next/core";

export class DailyMonitoringTaskInfraMapper
  implements
    InfrastructureMapper<DailyMonitoringTask, DailyMonitoringTaskPersistenceDto>
{
  toPersistence(
    entity: DailyMonitoringTask
  ): DailyMonitoringTaskPersistenceDto {
    return {
      id: entity.id as string,
      monitoringId: entity.getMonitoringId(),
      status: entity.getStatus(),
      task: entity.getTask(),
      effectiveDate: entity.props.effectiveDate.toString(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toDomain(record: DailyMonitoringTaskPersistenceDto): DailyMonitoringTask {
    const createProps: CreateDailyMonitoringTask = {
      monitoringId: record.monitoringId,
      status: record.status,
      task: {
        category: record.task.category,
        code: record.task.code.unpack(),
      },
      effectiveDate: record.effectiveDate,
    };

    const result = DailyMonitoringTask.create(createProps, record.id);
    if (result.isFailure) {
      throw new Error(
        `Failed to create DailyMonitoringTask from persistence data: ${result.err}`
      );
    }

    return result.val;
  }
}
