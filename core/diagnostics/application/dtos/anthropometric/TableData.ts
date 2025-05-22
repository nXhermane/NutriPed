import { Sex } from "@shared";

export interface TableDataDto {
  value: number;
  severePos: number;
  moderatePos: number;
  median: number;
  moderateNeg: number;
  severeNeg: number;
  isUnisex: boolean;
  sex: Sex;
}
