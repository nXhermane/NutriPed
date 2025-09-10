import { AggregateID } from "@/core/shared";
import { NextCore } from "@/core/nutrition_care/domain";

export interface DailyMonitoringTaskDto {
  id: AggregateID;
  monitoringId: AggregateID;
  status: NextCore.DailyMonitoringTaskStatus;
  task: NextCore.IMonitoringTask;
  effectiveDate: string;
  createdAt: string;
  updatedAt: string;
}
