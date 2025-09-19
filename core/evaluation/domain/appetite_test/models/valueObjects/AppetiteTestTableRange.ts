import {
  ArgumentInvalidException,
  Guard,
  handleError,
  Result,
  ValueObject,
} from "@shared";
import { APPETITE_TEST_SACHET_FRACTION_PARTITION } from "../constants";

export interface IAppetiteTestTableRange {
  weightRange: [number, number];
  sachetRange: [
    APPETITE_TEST_SACHET_FRACTION_PARTITION,
    APPETITE_TEST_SACHET_FRACTION_PARTITION,
  ];
  potRange: [number, number];
}

export class AppetiteTestTableRange extends ValueObject<IAppetiteTestTableRange> {
  protected validate(props: Readonly<IAppetiteTestTableRange>): void {
    if (
      Guard.isNegative(props.weightRange[0]).succeeded ||
      Guard.isNegative(props.weightRange[1]).succeeded
    ) {
      throw new ArgumentInvalidException(
        "The weight range can't have the negative value."
      );
    }
    // BETA: Ajuster la vérification du potRange later
  }
  static create(
    props: IAppetiteTestTableRange
  ): Result<AppetiteTestTableRange> {
    try {
      return Result.ok(new AppetiteTestTableRange(props));
    } catch (e) {
      return handleError(e);
    }
  }
}
