import { GrowthIndicatorRange, ICondition } from "../../../domain";

export interface IndicatorInterpreterDto {
  name: string;
  code: string;
  range: GrowthIndicatorRange;
  condition: ICondition;
}
