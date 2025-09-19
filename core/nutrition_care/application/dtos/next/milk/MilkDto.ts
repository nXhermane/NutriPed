import { MilkType } from "@/core/constants";
import { AggregateID } from "@/core/shared";

export interface MilkDto {
  id: AggregateID;
  code: MilkType;
  name: string;
  notes: string[];
  createdAt: string;
  updatedAt: string;
}
