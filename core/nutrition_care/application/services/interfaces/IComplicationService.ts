import { AggregateID, AppServiceResponse, Message } from "@shared";
import {
  CreateComplicationRequest,
  GetComplicationRequest 
} from "../../useCases";
import { ComplicationDto } from "../../dtos";

export interface IComplicationAppService {
  create(req: CreateComplicationRequest): Promise<AppServiceResponse<{ id: AggregateID }> | Message>;
  get(req: GetComplicationRequest): Promise<AppServiceResponse<ComplicationDto[]> | Message>;
}