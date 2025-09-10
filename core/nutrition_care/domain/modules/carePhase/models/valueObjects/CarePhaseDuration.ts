import { CARE_PHASE_DURATION_TYPE } from "@/core/constants";
import {
  Guard,
  handleError,
  NegativeValueError,
  Result,
  ValueObject,
} from "@/core/shared";

export interface ICarePhaseDuration {
  type: CARE_PHASE_DURATION_TYPE;
  value?: number;
}
export interface CreateCarePhaseDuration {
  type: CARE_PHASE_DURATION_TYPE;
  value?: number;
}
export class CarePhaseDuration extends ValueObject<ICarePhaseDuration> {
  getType() {
    return this.props.type;
  }
  getValue() {
    return this.props.value;
  }
  protected validate(props: Readonly<ICarePhaseDuration>): void {
    if (props.value && Guard.isNegative(props.value).succeeded) {
      throw new NegativeValueError(
        "The value of care phase duration if it provided can't not be negative."
      );
    }
  }
  static create(
    createProps: CreateCarePhaseDuration
  ): Result<CarePhaseDuration> {
    try {
      return Result.ok(new CarePhaseDuration(createProps));
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
