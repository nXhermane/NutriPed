import {
  formatError,
  Guard,
  handleError,
  NegativeValueError,
  Result,
  ValueObject,
} from "@shared";
import { Condition, ICondition } from "../../../common";

export interface IBiochemicalRange {
  condition: Condition;
  range: {
    min: [value: number, notStrict: boolean];
    max: [value: number, notStrict: boolean];
  };
  under: string[]; // Same here:But i'm not fix this for the moment || FIXME: je sais quoi faire maintenant. nous pouvons lier cette deduction a un sign clinic par exemple le patient a une peau pale on fera une deduction en disante que la personne a une anémie bon en tout cas ce n'est pas encore totalement claire maintenant

  over: string[]; // the note when the patient is in over this biochemical Reference
}
export interface CreateBiochemicalRange {
  condition: ICondition;
  range: {
    min: [value: number, notStrict: boolean];
    max: [value: number, notStrict: boolean];
  };
  under: string[]; // Same here:But i'm not fix this for the moment
  over: string[]; // the note when the patient is in over this biochemical Reference
}
export class BiochemicalRange extends ValueObject<IBiochemicalRange> {
  protected validate(props: Readonly<IBiochemicalRange>): void {
    if (
      Guard.isNegative(props.range.min[0]).succeeded ||
      Guard.isNegative(props.range.max[0]).succeeded
    )
      throw new NegativeValueError(
        "The value of biochemicalRange can't be negative value. Please recheck the reference value."
      );
  }
  static create(props: CreateBiochemicalRange): Result<BiochemicalRange> {
    try {
      const conditionRes = Condition.create(props.condition);
      if (conditionRes.isFailure)
        return Result.fail(formatError(conditionRes, BiochemicalRange.name));
      return Result.ok(
        new BiochemicalRange({
          condition: conditionRes.val,
          range: props.range,
          under: props.under,
          over: props.over,
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
