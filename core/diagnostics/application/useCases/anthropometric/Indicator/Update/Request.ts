import { AggregateID } from "@shared";
import { IndicatorDto } from "../../../../dtos";

export type UpdateIndicatorRequest = {
   id: AggregateID;
   data: Partial<Omit<IndicatorDto, "id" | "updatedAt" | "createdAt" | "code">>;
};
