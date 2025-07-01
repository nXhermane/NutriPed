import {
  EmptyStringError,
  Guard,
  handleError,
  Result,
  SystemCode,
  UnitCode,
  ValueObject,
} from "@shared";
import {
  GrowthIndicatorRange,
  GrowthStandard,
  StandardShape,
} from "./../constants";

export interface IGrowthIndicatorValue {
  code: SystemCode;
  unit: UnitCode;
  growthStandard: GrowthStandard;
  referenceSource: StandardShape;
  valueRange: GrowthIndicatorRange;
  interpretation: string;
  value: number;
  isValid: boolean;
  computedValue: [xAxis: number, yAxis: number]
}
export type CreateGrowthIndicatorValueProps = {
  code: string;
  unit: string;
  growthStandard: GrowthStandard;
  referenceSource: StandardShape;
  valueRange: GrowthIndicatorRange;
  interpretation: string;
  value: number;
  isValid: boolean;
  computedValue: [xAxis: number, yAxis: number]
};
export class GrowthIndicatorValue extends ValueObject<IGrowthIndicatorValue> {
  protected validate(props: Readonly<IGrowthIndicatorValue>): void {
    if (Guard.isEmpty(props.interpretation).succeeded) {
      throw new EmptyStringError(
        "The GrowthIndicatorValue interpretation can't be empty."
      );
    }
  }

  static create(
    createProps: CreateGrowthIndicatorValueProps
  ): Result<GrowthIndicatorValue> {
    try {
      const codeRes = SystemCode.create(createProps.code);
      const unitRes = UnitCode.create(createProps.unit);
      const combinedRes = Result.combine([codeRes, unitRes]);
      if (combinedRes.isFailure) return Result.fail(String(combinedRes.err));
      const growthIndicatorValue = new GrowthIndicatorValue({
        code: codeRes.val,
        unit: unitRes.val,
        growthStandard: createProps.growthStandard,
        referenceSource: createProps.referenceSource,
        valueRange: createProps.valueRange,
        value: createProps.value,
        interpretation: createProps.interpretation,
        isValid: createProps.isValid,
        computedValue: createProps.computedValue
      });
      return Result.ok(growthIndicatorValue);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
