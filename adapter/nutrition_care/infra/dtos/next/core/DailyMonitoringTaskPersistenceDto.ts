import { EntityPersistenceDto } from "@/adapter/shared";
import { AggregateID } from "@/core/shared";
import { NextCore } from "@/core/nutrition_care/domain";

export interface DailyMonitoringTaskPersistenceDto
  extends EntityPersistenceDto {
  monitoringId: AggregateID;
  status: NextCore.DailyMonitoringTaskStatus;
  task: NextCore.IMonitoringTask;
  effectiveDate: string;
}
