import { AggregateID, AppServiceResponse, Message } from "@shared";
import {
  CreateIndicatorRequest,
  DeleteIndicatorRequest,
  GetIndicatorRequest,
  UpdateIndicatorRequest,
} from "../../useCases";
import { IndicatorDto } from "../../dtos";

export interface IIndicatorService {
  create(
    req: CreateIndicatorRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message>;
  get(
    req: GetIndicatorRequest
  ): Promise<AppServiceResponse<IndicatorDto[]> | Message>;
  update(
    req: UpdateIndicatorRequest
  ): Promise<AppServiceResponse<IndicatorDto> | Message>;
  delete(
    req: DeleteIndicatorRequest
  ): Promise<AppServiceResponse<IndicatorDto> | Message>;
}
