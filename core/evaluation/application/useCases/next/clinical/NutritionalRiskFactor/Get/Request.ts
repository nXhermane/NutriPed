import { AggregateID } from "@/core/shared";

export type GetNutritionalRiskFactorRequest = {
  id?: AggregateID;
  clinicalSignCode?: string;
};
