import { MilkType } from "@/core/constants";
import { AggregateID } from "@/core/shared";

export interface GetMilkRequest {
  code?: MilkType;
  id?: AggregateID;
}
