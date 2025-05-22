import { AggregateID } from "@shared";

export interface ComplicationDto {
  id: AggregateID;
  name: string;
  code: string;
  description: string;
  updatedAt: string;
  createdAt: string;
}
