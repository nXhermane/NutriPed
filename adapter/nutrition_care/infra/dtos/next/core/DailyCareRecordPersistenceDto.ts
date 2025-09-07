import { EntityPersistenceDto } from "@/adapter/shared";
import { AggregateID } from "@/core/shared";
import { DailyCareRecordStatus } from "@/core/nutrition_care/domain/next/core/models/entities";
import { DailyCareActionPersistenceDto } from "./DailyCareActionPersistenceDto";
import { DailyMonitoringTaskPersistenceDto } from "./DailyMonitoringTaskPersistenceDto";

export interface DailyCareRecordPersistenceDto extends EntityPersistenceDto {
  date: string;
  status: DailyCareRecordStatus;
  treatmentActions: DailyCareActionPersistenceDto[];
  monitoringTasks: DailyMonitoringTaskPersistenceDto[];
}
