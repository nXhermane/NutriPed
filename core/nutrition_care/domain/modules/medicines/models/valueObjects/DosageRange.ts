import {
  Guard,
  handleError,
  NegativeValueError,
  Result,
  ValueObject,
} from "@shared";
import { DosageUnit } from "../constants";

export type Amount =
  | { value: number; unit: DosageUnit }
  | { minValue: number; maxValue: number; unit: DosageUnit };

export interface WeightRange {
  min: number;
  max: number;
  description: string;
}

export interface IDosageRange {
  weightRange: WeightRange;
  amount: Amount;
  frequency: number;
}
export class DosageRange extends ValueObject<IDosageRange> {
  haveIntervalAmount(): boolean {
    return !("value" in this.props.amount);
  }
  protected validate(props: Readonly<IDosageRange>): void {
    if (
      Guard.isNegative(props.weightRange.max).succeeded ||
      Guard.isNegative(props.weightRange.max).succeeded
    ) {
      throw new NegativeValueError(
        "The weight range limit must be a positive number."
      );
    }
    if (Guard.isNegative(props.frequency).succeeded || props.frequency === 0) {
      throw new NegativeValueError(
        "The frequency of dosage must be greater than zero."
      );
    }
  }
  static create(props: IDosageRange): Result<DosageRange> {
    try {
      return Result.ok(new DosageRange(props));
    } catch (e) {
      return handleError(e);
    }
  }
}
