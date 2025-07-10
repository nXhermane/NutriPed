import { ValueObject } from "../../common";
import { isValidCondition } from "./../../../utils";
import {
  ArgumentInvalidException,
  EmptyStringError,
  handleError,
} from "./../../../exceptions";
import { Guard, Result } from "./../../../core";
export interface ICondition {
  value: string;
  variables: string[];
}
export class Condition extends ValueObject<ICondition> {
  protected validate(props: Readonly<ICondition>): void {
    if (!isValidCondition(props.value))
      throw new ArgumentInvalidException(
        "The  condition is invalid. Please provide an valid condition."
      );
    if (props.variables.some(variable => Guard.isEmpty(variable).succeeded))
      throw new EmptyStringError("The condition variable can't be empty.");
  }
  static create(props: ICondition): Result<Condition> {
    try {
      return Result.ok(new Condition(props));
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
