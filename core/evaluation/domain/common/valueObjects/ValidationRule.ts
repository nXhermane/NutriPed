import {
  ArgumentInvalidException,
  Guard,
  handleError,
  isValidCondition,
  Result,
  ValueObject,
} from "@shared";

export interface IValidationRule {
  condition: string;
  rule: string;
  variables: string[];
}

export class ValidationRule extends ValueObject<IValidationRule> {
  protected validate(props: Readonly<IValidationRule>): void {
    if (!isValidCondition(props.condition)) {
      throw new ArgumentInvalidException(
        "The provide condition must be valid. Please check a provided condition."
      );
    }
    if (!isValidCondition(props.rule)) {
      throw new ArgumentInvalidException(
        "The provide rule must be valid. Please check a provided rule."
      );
    }
    if (props.variables.some(variable => Guard.isEmpty(variable).succeeded)) {
      throw new ArgumentInvalidException(
        "The name of variable can't be empty."
      );
    }
  }
  static create(props: IValidationRule): Result<ValidationRule> {
    try {
      return Result.ok(new ValidationRule(props));
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
