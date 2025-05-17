export interface IChartData {
  value: number;
  median: number;
  l: number;
  s: number;
  curvePoints: Record<string, number>;
}
