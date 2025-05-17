export interface ChartDataDto {
   value: number;
   median: number;
   l: number;
   s: number;
   curvePoints: Record<string, number>;
}
