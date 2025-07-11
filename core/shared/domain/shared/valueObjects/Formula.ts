import { ValueObject } from "../../common";
import { isValidCondition } from "./../../../utils";
import {
  ArgumentInvalidException,
  EmptyStringError,
  handleError,
} from "./../../../exceptions";
import { Guard, Result } from "./../../../core";
export interface IFormula {
  value: string;
  variables: string[];
}

export class Formula extends ValueObject<IFormula> {
  protected validate(props: Readonly<IFormula>): void {
    if (!isValidCondition(props.value)) {
      throw new ArgumentInvalidException(
        "The formula value is not valid. Please provide a valid formula."
      );
    }
    if (props.variables.some(variable => Guard.isEmpty(variable).succeeded)) {
      throw new EmptyStringError("The formula variable name can't be empty.");
    }
  }
  static create(props: IFormula): Result<Formula> {
    try {
      return Result.ok(new Formula(props));
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
