import { DailyMonitoringTask, DailyMonitoringTaskRepository } from "@/core/nutrition_care/domain/next/core";
import { EntityBaseRepositoryExpo } from "../../../../../shared";
import { DailyMonitoringTaskPersistenceDto } from "../../../dtos/next/core";
import { daily_monitoring_tasks } from "../../db";
import { AggregateID } from "@/core/shared";

export class DailyMonitoringTaskRepositoryExpoImpl
  extends EntityBaseRepositoryExpo<
    DailyMonitoringTask,
    DailyMonitoringTaskPersistenceDto,
    typeof daily_monitoring_tasks
  >
  implements DailyMonitoringTaskRepository
{
  async exist(id: AggregateID): Promise<boolean> {
    return this._exist(id);
  }
}