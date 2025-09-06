import {
  AggregateID,
  ArgumentOutOfRangeException,
  BaseEntityProps,
  DomainDateTime,
  Entity,
  EntityPropsBaseType,
  formatError,
  handleError,
  Result,
} from "@/core/shared";
import {
  CreateDailyCareAction,
  DailyCareAction,
  IDailyCareAction,
} from "./DailyCareAction";
import {
  CreateDailyMonitoringTask,
  DailyMonitoringTask,
  IDailyMonitoringTask,
} from "./DailyMonitoringTask";

export interface IDailyCareRecord extends EntityPropsBaseType {
  date: DomainDateTime;
  treatmentActions: DailyCareAction[];
  monitoringTasks: DailyMonitoringTask[];
}
export interface CreateDailyCareRecord {
  date: string;
  treatmentActions: (CreateDailyCareAction & { id: AggregateID })[];
  monitoringTasks: (CreateDailyMonitoringTask & { id: AggregateID })[];
}

export class DailyCareRecord extends Entity<IDailyCareRecord> {
  getDate(): string {
    return this.props.date.toString();
  }
  getActions(): (IDailyCareAction & BaseEntityProps)[] {
    return this.props.treatmentActions.map(entity => entity.getProps());
  }
  getTasks(): (IDailyMonitoringTask & BaseEntityProps)[] {
    return this.props.monitoringTasks.map(entity => entity.getProps());
  }
  addAction(action: DailyCareAction) {
    const findedIndex = this.props.treatmentActions.findIndex(act => act.getTreatmentId() === action.getTreatmentId() && act.getProps().effectiveDate.isSameDateTime(action.getProps().effectiveDate));
    if(findedIndex === -1) {
      this.props.treatmentActions.push(action);
    }
    this.validate();
  }
  addTask(task: DailyMonitoringTask) {
    // CHECK: if it the good decision to use effective date for juste the simple verification of singularity of task.
    const findedIndex = this.props.monitoringTasks.findIndex(existingTask =>
     existingTask.getProps().effectiveDate.isSameDateTime(task.getProps().effectiveDate) &&
      existingTask.getTask().code === task.getTask().code
    );
    if (findedIndex === -1) {
      this.props.monitoringTasks.push(task);
    }
    this.validate();
  }
  changeAction(action: DailyCareAction) {
    const findedIndex = this.props.treatmentActions.findIndex(entity =>
      entity.equals(action)
    );
    if (findedIndex !== -1) {
      this.props.treatmentActions[findedIndex] = action;
      this.validate();
    }
  }
  changeTask(task: DailyMonitoringTask) {
    const findedIndex = this.props.monitoringTasks.findIndex(entity =>
      entity.equals(task)
    );
    if (findedIndex !== -1) {
      this.props.monitoringTasks[findedIndex] = task;
      this.validate();
    }
  }
  deleteAction(id: AggregateID) {
    const findedIndex = this.props.treatmentActions.findIndex(
      entity => entity.id === id
    );
    if (findedIndex !== -1) {
      this.props.treatmentActions.splice(findedIndex, 1);
      this.validate();
    }
  }
  deleteTask(id: AggregateID) {
    const findedIndex = this.props.monitoringTasks.findIndex(
      entity => entity.id === id
    );
    if (findedIndex !== -1) {
      this.props.monitoringTasks.splice(findedIndex, 1);
      this.validate();
    }
  }

  getPendingItems(): {
    actions: DailyCareAction[];
    tasks: DailyMonitoringTask[];
  } {
    const pendingActions = this.props.treatmentActions.filter(
      action => !action.isCompleted()
    );
    const pendingTasks = this.props.monitoringTasks.filter(
      task => !task.isCompleted()
    );

    return { actions: pendingActions, tasks: pendingTasks };
  }
  isCompleted(): boolean {
    const allActionsCompleted = this.props.treatmentActions.every(action =>
      action.isCompleted()
    );
    const allTasksCompleted = this.props.monitoringTasks.every(task =>
      task.isCompleted()
    );

    return allActionsCompleted && allTasksCompleted;
  }

  public validate(): void {
    this._isValid = false;
    const today = DomainDateTime.now();
    if (this.props.date.isAfter(today)) {
      throw new ArgumentOutOfRangeException(
        "Cannot create daily records for future dates"
      );
    }
    this._isValid = true;
  }
  static create(
    createProps: CreateDailyCareRecord,
    id: AggregateID
  ): Result<DailyCareRecord> {
    try {
      const dateRes = DomainDateTime.create(createProps.date);
      const actionsRes = createProps.treatmentActions.map(({ id, ...props }) =>
        DailyCareAction.create(props, id)
      );
      const tasksRes = createProps.monitoringTasks.map(({ id, ...props }) =>
        DailyMonitoringTask.create(props, id)
      );
      const combinedRes = Result.combine([dateRes, ...actionsRes, ...tasksRes]);
      if (combinedRes.isFailure) {
        return Result.fail(formatError(combinedRes, DailyCareRecord.name));
      }
      return Result.ok(
        new DailyCareRecord({
          id,
          props: {
            date: dateRes.val,
            treatmentActions: actionsRes.map(res => res.val),
            monitoringTasks: tasksRes.map(res => res.val),
          },
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
