import {
  AggregateID,
  Entity,
  EntityPropsBaseType,
  formatError,
  Formula,
  handleError,
  IFormula,
  Result,
  SystemCode,
} from "@/core/shared";

export interface IFormulaFieldReference extends EntityPropsBaseType {
  code: SystemCode<string>;
  formula: {
    formula: Formula;
    description: string;
    variablesExplanation: Record<string, string>;
  };
}

export interface CreateFormulaFieldReference {
  code: string;
  formula: {
    formula: IFormula;
    description: string;
    variablesExplanation: Record<string, string>;
  };
}

export class FormulaFieldReference extends Entity<IFormulaFieldReference> {
  getCode(): string {
    return this.props.code.unpack();
  }
  getFormula() {
    return {
      formula: this.props.formula.formula.unpack(),
      description: this.props.formula.description,
      variablesExplanation: this.props.formula.variablesExplanation,
    };
  }
  public validate(): void {
    this._isValid = false;
    // Implement the validation rule if needs ...
    this._isValid = true;
  }

  static create(
    createProps: CreateFormulaFieldReference,
    id: AggregateID
  ): Result<FormulaFieldReference> {
    try {
      const codeRes = SystemCode.create(createProps.code);
      const formulaRes = Formula.create(createProps.formula.formula);
      const combinedRes = Result.combine([codeRes, formulaRes]);
      if (combinedRes.isFailure) {
        return Result.fail(
          formatError(combinedRes, FormulaFieldReference.name)
        );
      }
      return Result.ok(
        new FormulaFieldReference({
          id,
          props: {
            code: codeRes.val,
            formula: {
              formula: formulaRes.val,
              description: createProps.formula.description,
              variablesExplanation: createProps.formula.variablesExplanation,
            },
          },
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
