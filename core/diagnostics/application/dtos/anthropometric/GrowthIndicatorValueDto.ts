import {
  GrowthIndicatorRange,
  GrowthStandard,
  StandardShape,
} from "../../../domain";

export interface GrowthIndicatorValueDto {
  code: string;
  unit: string;
  growthStandard: GrowthStandard;
  referenceSource: StandardShape;
  valueRange: GrowthIndicatorRange;
  interpretation: string;
  value: number;
}
