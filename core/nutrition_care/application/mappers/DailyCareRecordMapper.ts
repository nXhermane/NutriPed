import { ApplicationMapper } from "@/core/shared";
import {
  DailyCareActionDto,
  DailyCareRecordDto,
  DailyMonitoringTaskDto,
} from "../dtos";
import {
  DailyCareAction,
  DailyCareRecord,
  DailyMonitoringTask,
} from "../../domain/next/core/models/entities";

export class DailyCareRecordMapper
  implements ApplicationMapper<DailyCareRecord, DailyCareRecordDto>
{
  constructor(
    private readonly actionMapper: ApplicationMapper<
      DailyCareAction,
      DailyCareActionDto
    >,
    private readonly taskMapper: ApplicationMapper<
      DailyMonitoringTask,
      DailyMonitoringTaskDto
    >
  ) {}
  toResponse(entity: DailyCareRecord): DailyCareRecordDto {
    return {
      id: entity.id,
      date: entity.getDate(),
      status: entity.getStatus(),
      treatmentActions: entity
        .getProps()
        .treatmentActions.map(action => this.actionMapper.toResponse(action)),
      monitoringTasks: entity
        .getProps()
        .monitoringTasks.map(task => this.taskMapper.toResponse(task)),
      createdAt: entity.createdAt.toString(),
      updatedAt: entity.updatedAt.toString(),
    };
  }
}
