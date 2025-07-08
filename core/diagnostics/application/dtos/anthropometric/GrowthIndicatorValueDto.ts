import {
  GrowthIndicatorRange,
  GrowthRefChartAndTableCodes,
  GrowthStandard,
  StandardShape,
} from "../../../domain";

export interface GrowthIndicatorValueDto {
  code: string;
  unit: string;
  reference: {
    standard: GrowthStandard;
    source: GrowthRefChartAndTableCodes;
    sourceType: StandardShape;
  }
  valueRange: GrowthIndicatorRange;
  interpretation: string;
  value: number;
  isValid: boolean;
  computedValue: [xAxis: number, yAxis: number];
}
