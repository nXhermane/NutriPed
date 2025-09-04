import {
  formatError,
  handleError,
  Result,
  SystemCode,
  ValueObject,
} from "@/core/shared";

export enum MonitoringTaskCategory {
  ANTHROP = "anthropometric",
  CLINICAL = "clinical",
  BIOLOGICAL = "biological",
  DATA_FIELD = "data_field",
  DYNAMIC_CALCUL = "dynamical_calculation",
}
export interface IMonitoringTask {
  category: MonitoringTaskCategory;
  code: SystemCode<string>;
}

export interface CreateMonitoringTask {
  category: MonitoringTaskCategory;
  code: string;
}

export class MonitoringTask extends ValueObject<IMonitoringTask> {
  getCategory(): MonitoringTaskCategory {
    return this.props.category;
  }
  getCode(): string {
    return this.props.code.unpack();
  }
  protected validate(props: Readonly<IMonitoringTask>): void {
    // Implemente the validation rule if needed ...
  }
  static create(createProps: CreateMonitoringTask): Result<MonitoringTask> {
    try {
      const codeRes = SystemCode.create(createProps.code);
      if (codeRes.isFailure) {
        return Result.fail(formatError(codeRes, MonitoringTask.name));
      }
      return Result.ok(
        new MonitoringTask({
          category: createProps.category,
          code: codeRes.val,
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
