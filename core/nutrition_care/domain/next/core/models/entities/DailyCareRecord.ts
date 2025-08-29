import {
  AggregateID,
  DomainDateTime,
  Entity,
  EntityPropsBaseType,
} from "@/core/shared";
import { CreateDailyCareAction, DailyCareAction } from "./DailyCareAction";
import { CreateMonitoringTask, MonitoringTask } from "../valueObjects";

export interface IDailyCareRecord extends EntityPropsBaseType {
  date: DomainDateTime;
  treatmentActions: DailyCareAction[];
  monitoringTasks: MonitoringTask[];
}

export interface CreateDailyCareRecord {
  treatmentActions: (CreateDailyCareAction & { id: AggregateID })[];
  monitoringTasks: (CreateMonitoringTask & { id: AggregateID })[];
}

export class DailyCareRecord extends Entity<IDailyCareRecord> {
  public validate(): void {
    this._isValid = false;
    // Implemente the validation rule if needed ...
    this._isValid = true;
  }
  
}
