import {
  formatError,
  handleError,
  Result,
  SystemCode,
  ValueObject,
} from "@shared";

export interface INutrientImpact {
  nutrient: SystemCode;
  effect: "deficiency" | "excess";
}

export class NutrientImpact extends ValueObject<INutrientImpact> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected validate(props: Readonly<INutrientImpact>): void {
    // validation code here
  }

  static create(props: {
    nutrient: string;
    effect: "deficiency" | "excess";
  }): Result<NutrientImpact> {
    try {
      const codeRes = SystemCode.create(props.nutrient);
      if (codeRes.isFailure)
        return Result.fail(formatError(codeRes, NutrientImpact.name));
      return Result.ok(
        new NutrientImpact({ nutrient: codeRes.val, effect: props.effect })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
