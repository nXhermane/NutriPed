import {
  EmptyStringError,
  formatError,
  handleError,
} from "@/core/shared/exceptions";
import { ValueObject } from "../../common";
import { Condition, ICondition } from "./Condition";
import { Guard, Result } from "@/core/shared/core";

export interface ICriterion {
  description: string;
  condition: Condition;
  variablesExplanation: Record<string, string>;
}

export interface CreateCriterion {
  description: string;
  condition: ICondition;
  variablesExplanation: Record<string, string>;
}

export class Criterion extends ValueObject<ICriterion> {
  protected validate(props: Readonly<ICriterion>): void {
    if (Guard.isEmpty(props.description).succeeded) {
      throw new EmptyStringError(
        "The description of criterion can't be empty."
      );
    }
  }
  getCondition(): ICondition {
    return this.props.condition.unpack();
  }
  getDescription(): string {
    return this.props.description;
  }
  getVariablesExplanation(): Record<string, string> {
    return this.props.variablesExplanation;
  }
  static create(createProps: CreateCriterion): Result<Criterion> {
    try {
      const conditionRes = Condition.create(createProps.condition);
      if (conditionRes.isFailure) {
        return Result.fail(formatError(conditionRes, Criterion.name));
      }
      return Result.ok(
        new Criterion({
          description: createProps.description,
          variablesExplanation: createProps.variablesExplanation,
          condition: conditionRes.val,
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
