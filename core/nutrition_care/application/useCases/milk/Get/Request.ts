import { MilkType } from "./../../../../domain";
import { AggregateID } from "@shared";

export type GetMilkRequest = {
  milkId?: AggregateID;
  milkType?: MilkType;
};
