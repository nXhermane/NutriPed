import { AggregateID } from "@shared";
import { GrowthStandard } from "../../../domain";
import { ChartDataDto } from "./ChartDataDto";

export interface GrowthReferenceChartDto {
  id: AggregateID;
  code: string;
  name: string;
  standard: GrowthStandard;
  sex: "M" | "F";
  data: ChartDataDto[];
  createdAt: string;
  updatedAt: string;
}
