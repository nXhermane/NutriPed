import { DosageUnit } from "@/core/constants";
import {
  ArgumentOutOfRangeException,
  EmptyStringError,
  Guard,
  handleError,
  Result,
  ValueObject,
} from "@shared";

export interface IBaseDosage {
  label: string;
  frequency: number;
  min: number;
  max: number;
  unit: DosageUnit;
}
export class BaseDosage extends ValueObject<IBaseDosage> {
  isUniqueValue() {
    return this.props.max === this.props.min;
  }
  protected validate(props: Readonly<IBaseDosage>): void {
    if (Guard.isEmpty(props.label).succeeded) {
      throw new EmptyStringError("The base dosage label can't be empty.");
    }
    if (props.frequency < 1) {
      throw new ArgumentOutOfRangeException(
        "The base dosage frequency can't be greater than one."
      );
    }
  }
  static create(props: IBaseDosage): Result<BaseDosage> {
    try {
      return Result.ok(new BaseDosage(props));
    } catch (e) {
      return handleError(e);
    }
  }
}
