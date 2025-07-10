import { IChartData } from "./ChartData";
import { GrowthStandard } from "./GrowthStandard";

export interface GrowthReferenceChartProps {
  code: string;
  name: string;
  sex: "M" | "F";
  standard: GrowthStandard;
  data: IChartData[];
}
