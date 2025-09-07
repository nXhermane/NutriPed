import { AggregateID } from "@/core/shared";

export interface CarePhaseDto {
  id: AggregateID;
  name: string;
  createdAt: string;
  updatedAt: string;
}