import { AggregateID } from "@shared";
import { GrowthReferenceTableDto } from "../../../../dtos";

export type UpdateGrowthReferenceTableRequest = {
   id: AggregateID;
   data: Partial<Omit<GrowthReferenceTableDto, "id" | "createdAt" | "updatedAt" | "code">>;
};
