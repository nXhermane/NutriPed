import {
  CreateCriterion,
  Criterion,
  formatError,
  handleError,
  Result,
  ValueObject,
} from "@/core/shared";
import { CreateDosageFormula, DosageFormula } from "./DosageFormula";

export interface IConditionalDosageFormula {
  applicabilities: Criterion[];
  formula: DosageFormula;
}

export interface CreateConditionalDosageFormula {
  applicabilities: CreateCriterion[];
  formula: CreateDosageFormula;
}

export class ConditionalDosageFormula extends ValueObject<IConditionalDosageFormula> {
  protected validate(props: Readonly<IConditionalDosageFormula>): void {
    // Implemente the validation rule here if needed ...
  }
  static create(
    props: CreateConditionalDosageFormula
  ): Result<ConditionalDosageFormula> {
    try {
      const applicabilitiesRes = props.applicabilities.map(criterionProps =>
        Criterion.create(criterionProps)
      );
      const formulaRes = DosageFormula.create(props.formula);
      const combinedRes = Result.combine([...applicabilitiesRes, formulaRes]);
      if (combinedRes.isFailure) {
        return Result.fail(
          formatError(combinedRes, ConditionalDosageFormula.name)
        );
      }
      return Result.ok(
        new ConditionalDosageFormula({
          applicabilities: applicabilitiesRes.map(res => res.val),
          formula: formulaRes.val,
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
