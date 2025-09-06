import { AggregateID } from "@/core/shared";
import { DailyMonitoringTaskStatus } from "@/core/nutrition_care/domain/next/core/models/entities";
import { IMonitoringTask } from "@/core/nutrition_care/domain/next/core/models/valueObjects";

export interface DailyMonitoringTaskDto {
  id: AggregateID;
  monitoringId: AggregateID;
  status: DailyMonitoringTaskStatus;
  task: IMonitoringTask;
  effectiveDate: string;
  createdAt: string;
  updatedAt: string;
}
