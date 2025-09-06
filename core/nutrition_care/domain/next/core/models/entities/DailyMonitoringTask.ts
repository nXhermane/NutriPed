import {
  AggregateID,
  DomainDate,
  DomainDateTime,
  Entity,
  EntityPropsBaseType,
  formatError,
  Guard,
  handleError,
  InvalidReference,
  Result,
} from "@/core/shared";
import {
  CreateMonitoringTask,
  IMonitoringTask,
  MonitoringTask,
} from "../valueObjects";

export enum DailyMonitoringTaskStatus {
  COMPLETED = "completed",
  NOT_COMPLETED = "not_completed",
  IN_WAITING = "in_waiting",
}
export interface IDailyMonitoringTask extends EntityPropsBaseType {
  monitoringId: AggregateID;
  status: DailyMonitoringTaskStatus;
  task: MonitoringTask;
  effectiveDate: DomainDateTime;
}

export interface CreateDailyMonitoringTask {
  monitoringId: AggregateID;
  status?: DailyMonitoringTaskStatus;
  task: CreateMonitoringTask;
  effectiveDate: string;
}

export class DailyMonitoringTask extends Entity<IDailyMonitoringTask> {
  getMonitoringId(): AggregateID {
    return this.props.monitoringId;
  }
  getStatus(): DailyMonitoringTaskStatus {
    return this.props.status;
  }
  getTask(): IMonitoringTask {
    return this.props.task.unpack();
  }
  completed() {
    this.props.status = DailyMonitoringTaskStatus.COMPLETED;
  }
  isCompleted(): boolean {
    return this.props.status === DailyMonitoringTaskStatus.COMPLETED;
  }
  notCompleted() {
    if (this.props.status === DailyMonitoringTaskStatus.IN_WAITING) {
      this.props.status = DailyMonitoringTaskStatus.NOT_COMPLETED;
    }
  }
  isNotCompleted(): boolean {
    return this.props.status === DailyMonitoringTaskStatus.NOT_COMPLETED;
  }
  isWaiting(): boolean {
    return this.props.status === DailyMonitoringTaskStatus.IN_WAITING;
  }
  public validate(): void {
    this._isValid = false;
    if (Guard.isEmpty(this.props.monitoringId).succeeded) {
      throw new InvalidReference(
        "The monitoring reference on daily monitoring task can't be empty."
      );
    }
    this._isValid = true;
  }
  static create(
    createProps: CreateDailyMonitoringTask,
    id: AggregateID
  ): Result<DailyMonitoringTask> {
    try {
      const taskRes = MonitoringTask.create(createProps.task);
      const effectiveDateRes = DomainDateTime.create(createProps.effectiveDate);
      const combinedRes = Result.combine([taskRes,effectiveDateRes]);
      if (combinedRes.isFailure) {
        return Result.fail(formatError(combinedRes, DailyMonitoringTask.name));
      }
      return Result.ok(
        new DailyMonitoringTask({
          id,
          props: {
            monitoringId: createProps.monitoringId,
            status: createProps.status || DailyMonitoringTaskStatus.IN_WAITING,
            task: taskRes.val,
            effectiveDate: effectiveDateRes.val
          },
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
