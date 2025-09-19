import { RecommendedMilkPerDay } from "@/core/constants";
import {
  ArgumentNotProvidedException,
  Guard,
  handleError,
  NegativeValueError,
  Result,
  ValueObject,
} from "@/core/shared";

export interface IDosageByWeight {
  weight_kg: number;
  dosePerMeal: Partial<Record<RecommendedMilkPerDay, number>>;
}

export class DosageByWeight extends ValueObject<IDosageByWeight> {
  getWeight() {
    return this.props.weight_kg;
  }
  getDosePerMeal() {
    return this.props.dosePerMeal;
  }
  protected validate(props: Readonly<IDosageByWeight>): void {
    if (Guard.isNegative(props.weight_kg).succeeded) {
      throw new NegativeValueError(
        "The weight can't be negative value on dosage by weight."
      );
    }
    if (Guard.isEmpty(props.dosePerMeal).succeeded) {
      throw new ArgumentNotProvidedException(
        "The dose per meal can't be empty."
      );
    }
  }
  static create(props: IDosageByWeight): Result<DosageByWeight> {
    try {
      return Result.ok(new DosageByWeight(props));
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
