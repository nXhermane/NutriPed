import { AggregateID, AppServiceResponse, Message } from "@shared";
import { CreateMilkRequest, GetMilkRequest } from "../../useCases/next/milk";

export interface IMilkServiceNext {
  create(
    req: CreateMilkRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message>;

  get(req: GetMilkRequest): Promise<AppServiceResponse<any[]> | Message>;
}
