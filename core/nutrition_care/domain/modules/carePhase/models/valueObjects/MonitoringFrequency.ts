import { MONITORING_FREQUENCY_TYPE } from "@/core/constants";
import {
  Guard,
  handleError,
  NegativeValueError,
  Result,
  ValueObject,
} from "@/core/shared";

export interface IMonitoringFrequency {
  intervalUnit: MONITORING_FREQUENCY_TYPE;
  intervalValue: number;
  countInUnit: number;
}
export class MonitoringFrequency extends ValueObject<IMonitoringFrequency> {
  getUnit(): MONITORING_FREQUENCY_TYPE {
    return this.props.intervalUnit;
  }
  getIntervalValue(): number {
    return this.props.intervalValue;
  }
  getCountInUnit(): number {
    return this.props.countInUnit;
  }
  protected validate(props: Readonly<IMonitoringFrequency>): void {
    if (
      Guard.isNegative(props.countInUnit).succeeded ||
      Guard.isNegative(props.intervalValue).succeeded
    ) {
      throw new NegativeValueError(
        "The countInUnit or intervalValue can't be empty."
      );
    }
  }
  static create(props: IMonitoringFrequency): Result<MonitoringFrequency> {
    try {
      return Result.ok(new MonitoringFrequency(props));
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
