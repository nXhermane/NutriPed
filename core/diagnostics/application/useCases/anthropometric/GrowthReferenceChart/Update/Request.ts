import { AggregateID } from "@shared";
import { GrowthReferenceChartDto } from "../../../../dtos";

export type UpdateGrowthReferenceChartRequest = {
   id: AggregateID;
   data: Partial<Omit<GrowthReferenceChartDto, "id" | "createdAt" | "updatedAt" | "code">>;
};
