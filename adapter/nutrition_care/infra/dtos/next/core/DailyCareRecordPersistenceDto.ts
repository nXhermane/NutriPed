import { EntityPersistenceDto } from "@/adapter/shared";
import { DailyCareRecordStatus } from "@/core/nutrition_care/domain/next/core/models/entities";
import { AggregateID } from "@/core/shared";
import { NextCore } from "@/core/nutrition_care";

export interface DailyCareRecordPersistenceDto extends EntityPersistenceDto {
  date: string;
  status: DailyCareRecordStatus;
  treatmentActions: AggregateID[];
  monitoringTasks: AggregateID[];
}
export interface DailyCareRecordPersistenceRecordDto extends EntityPersistenceDto {
date: string;
status: DailyCareRecordStatus;
treatmentActions: NextCore.DailyCareAction[];
monitoringTasks: NextCore.DailyMonitoringTask[];
}