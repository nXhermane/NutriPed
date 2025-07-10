export interface TableData {
  value: number;
  hightSeverPos?: number;
  severePos?: number;
  moderatePos?: number;
  normalPos?: number;
  median: number;
  normalNeg?: number;
  outComeTargetValueNeg: number;
  moderateNeg: number;
  severeNeg: number;
  hightSeverNeg?: number;
  isUnisex: boolean;
  sex?: "M" | "F";
}
