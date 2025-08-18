import { Sex } from "@shared";

export interface TableDataDto {
  value: number;
  median: number;
  normalNeg: number;
  moderateNeg: number;
  hightSeverNeg: number;
  outComeTargetValueNeg: number;
  severeNeg: number;
  isUnisex: boolean;
  sex: Sex;
}
