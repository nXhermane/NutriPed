import {
  formatError,
  Guard,
  handleError,
  NegativeValueError,
  Result,
  SystemCode,
  UnitCode,
  ValueObject,
} from "@shared";
/**
 * @interface IAnthropometricData contain all patient anthropometric data
 * @property weight - The weight in kg
 * @property height - The height in cm
 * @property length - The length in cm also
 * @property armCircumference - The ArmCircumference in cm
 * @property headCircumference - The headCircumference in cm
 */

export type AnthropEntry = {
  code: SystemCode;
  value: number;
  unit: UnitCode;
};
// LE model a été mise a jour pour passer a un tableau de donnée anthropometric
export type IAnthropometricData = {entry: AnthropEntry[]};
export type CreateAnthropometricData = {
  anthropometricMeasures: { code: string; value: number; unit: string }[];
};
export class AnthropometricData extends ValueObject<IAnthropometricData> {
  protected validate(props: Readonly<IAnthropometricData>): void {
    if (props.entry.some(anthrop => Guard.isNegative(anthrop.value).succeeded)) {
      throw new NegativeValueError(
        "The anthropometric measure value can't be negative."
      );
    }
  }
  static create(
    createAnthropometricProps: CreateAnthropometricData
  ): Result<AnthropometricData> {
    try {
      const anthropometricMeasuresRes =
        createAnthropometricProps.anthropometricMeasures.map(
          (anthropMeasure): Result<AnthropEntry> => {
            const codeRes = SystemCode.create(anthropMeasure.code);
            const unitRes = UnitCode.create(anthropMeasure.unit);
            const combinedRes = Result.combine([codeRes, unitRes]);
            if (combinedRes.isFailure)
              return Result.fail(
                formatError(combinedRes, AnthropometricData.name)
              );
            return Result.ok({
              code: codeRes.val,
              value: anthropMeasure.value,
              unit: unitRes.val,
            });
          }
        );
      const combinedRes = Result.combine(anthropometricMeasuresRes);
      if (combinedRes.isFailure)
        return Result.fail(formatError(combinedRes, AnthropometricData.name));

      return Result.ok(
        new AnthropometricData({entry: anthropometricMeasuresRes.map(res => res.val)})
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
