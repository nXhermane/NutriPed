import {
  Guard,
  handleError,
  NegativeValueError,
  Result,
  ValueObject,
} from "@shared";
import { MilkType, RecommendedMilkPerDay } from "../constants";

export interface IMilkSuggestionResult {
  milkType: MilkType;
  calculatedVolumeMl: number;
  recommendedVolumeMl: number;
  feedingFrequencies: RecommendedMilkPerDay[];
}

export class MilkSuggestionResult extends ValueObject<IMilkSuggestionResult> {
  protected validate(props: Readonly<IMilkSuggestionResult>): void {
    if (
      Guard.isNegative(props.calculatedVolumeMl).succeeded ||
      Guard.isNegative(props.recommendedVolumeMl).succeeded
    ) {
      throw new NegativeValueError("The milk volume can't be negative.");
    }
  }
  static create(props: IMilkSuggestionResult): Result<MilkSuggestionResult> {
    try {
      return Result.ok(new MilkSuggestionResult(props));
    } catch (e) {
      return handleError(e);
    }
  }
}
