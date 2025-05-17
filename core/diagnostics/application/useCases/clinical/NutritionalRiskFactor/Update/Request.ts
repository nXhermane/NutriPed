import { AggregateID } from "@shared";
import { NutritionalRiskFactorDto } from "../../../../dtos";

export type UpdateNutritionalRiskFactorRequest = {
   id: AggregateID;
   data: Partial<Omit<NutritionalRiskFactorDto, "id" | "createdAt" | "updatedAt">>;
};
