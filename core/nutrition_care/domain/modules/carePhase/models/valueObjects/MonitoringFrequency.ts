import { FREQUENCY_TYPE } from "@/core/constants";
import {
  Guard,
  handleError,
  NegativeValueError,
  Result,
  ValueObject,
} from "@/core/shared";

export interface IFrequency {
  intervalUnit: FREQUENCY_TYPE;
  intervalValue: number;
  countInUnit: number;
}
export class Frequency extends ValueObject<IFrequency> {
  getUnit(): FREQUENCY_TYPE {
    return this.props.intervalUnit;
  }
  getIntervalValue(): number {
    return this.props.intervalValue;
  }
  getCountInUnit(): number {
    return this.props.countInUnit;
  }
  protected validate(props: Readonly<IFrequency>): void {
    if (
      Guard.isNegative(props.countInUnit).succeeded ||
      Guard.isNegative(props.intervalValue).succeeded
    ) {
      throw new NegativeValueError(
        "The countInUnit or intervalValue can't be empty."
      );
    }
  }
  static create(props: IFrequency): Result<Frequency> {
    try {
      return Result.ok(new Frequency(props));
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
