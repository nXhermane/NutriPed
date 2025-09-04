import { DosageFormulaUnit } from "@/core/constants";
import {
  EmptyStringError,
  formatError,
  Formula,
  Guard,
  handleError,
  IFormula,
  Result,
  ValueObject,
} from "@/core/shared";

export interface IDosageFormula {
  min: Formula;
  max: Formula | null;
  unit: DosageFormulaUnit;
  description: string;
  variableExplanation: Record<string, string>;
}

export interface CreateDosageFormula {
  min: IFormula;
  max: IFormula | null;
  unit: DosageFormulaUnit;
  description: string;
  variableExplanation: Record<string, string>;
}

export class DosageFormula extends ValueObject<IDosageFormula> {
  protected validate(props: Readonly<IDosageFormula>): void {
    if (Guard.isEmpty(props.description).succeeded) {
      throw new EmptyStringError(
        "The description of the dosage formula can't be empty."
      );
    }
  }

  static create(createProps: CreateDosageFormula): Result<DosageFormula> {
    try {
      const minRes = Formula.create(createProps.min);
      const maxRes =
        createProps.max !== null
          ? Formula.create(createProps.max)
          : Result.ok(null);
      const combinedRes = Result.combine([minRes, maxRes as any]);
      if (combinedRes.isFailure) {
        return Result.fail(formatError(combinedRes, DosageFormula.name));
      }
      return Result.ok(
        new DosageFormula({
          min: minRes.val,
          max: maxRes.val,
          description: createProps.description,
          unit: createProps.unit,
          variableExplanation: createProps.variableExplanation,
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
