import { ICondition } from "../../../domain";

export interface BiochemicalRangeDto {
  condition: ICondition;
  range: {
    min: [value: number, notStrict: boolean];
    max: [value: number, notStrict: boolean];
  };
  under: string[];
  over: string[];
}
