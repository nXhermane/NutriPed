import { AggregateID } from "@/core/shared";
import { DailyCareRecordStatus } from "@/core/nutrition_care/domain/next/core/models/entities";
import { DailyCareActionDto } from "./DailyCareActionDto";
import {DailyMonitoringTaskDto} from "./DailyMonitoringTaskDto";

export interface DailyCareRecordDto {
  id: AggregateID;
  date: string;
  status: DailyCareRecordStatus;
  treatmentActions: DailyCareActionDto[];
  monitoringTasks: DailyMonitoringTaskDto[];
  createdAt: string;
  updatedAt: string;
}
