import { EntityPersistenceDto } from "@/adapter/shared";
import { AggregateID } from "@/core/shared";
import { NextCore } from "@/core/nutrition_care/domain";

export interface MonitoringParameterPersistenceDto
  extends EntityPersistenceDto {
  startDate: string;
  endDate: string | null;
  nextTaskDate: string | null;
  lastExecutionDate: string | null;
  element: NextCore.CreateMonitoringParameterElement;
}
