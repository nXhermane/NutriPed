import {
  CreateCriterion,
  Criterion,
  formatError,
  handleError,
  Result,
  ValueObject,
} from "@/core/shared";
import { BaseDosage } from "./BaseDosage";
import { DosageRange, IDosageRange } from "./DosageRange";
import { IBaseDosage } from "../../../../medicines";

export interface IDosageCase {
  condition: Criterion;
  base: BaseDosage;
  ranges: DosageRange[];
}
export interface CreateDosageCase {
  condition: CreateCriterion;
  base: IBaseDosage;
  ranges: IDosageRange[];
}
export class DosageCase extends ValueObject<IDosageCase> {
  protected validate(props: Readonly<IDosageCase>): void {
    // Implement the validation rule here if it needs ...
  }
  static create(createProps: CreateDosageCase): Result<DosageCase> {
    try {
      const conditionRes = Criterion.create(createProps.condition);
      const baseDosageRes = BaseDosage.create(createProps.base);
      const rangesDosageRes = createProps.ranges.map(range =>
        DosageRange.create(range)
      );
      const combinedRes = Result.combine([
        conditionRes,
        ...rangesDosageRes,
        baseDosageRes,
      ]);
      if (combinedRes.isFailure) {
        return Result.fail(formatError(combinedRes, DosageCase.name));
      }
      return Result.ok(
        new DosageCase({
          base: baseDosageRes.val,
          condition: conditionRes.val,
          ranges: rangesDosageRes.map(res => res.val),
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
