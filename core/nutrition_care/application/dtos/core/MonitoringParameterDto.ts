import { AggregateID } from "@/core/shared";
import { IMonitoringParameterElement } from "@/core/nutrition_care/domain/next/core/models/valueObjects";

export interface MonitoringParameterDto {
  id: AggregateID;
  startDate: string;
  endDate: string | null;
  nextTaskDate: string | null;
  lastExecutionDate: string | null;
  element: IMonitoringParameterElement;
  createdAt: string;
  updatedAt: string;
}
