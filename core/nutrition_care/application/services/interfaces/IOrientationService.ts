import { AggregateID, AppServiceResponse, Message } from "@shared";
import {
  CreateOrientationRefRequest,
  GetOrientationRefRequest,
  OrientationResultDto,
  OrientRequest
} from "../../useCases";
import { OrientationRefDto } from "../../dtos";

export interface IOrientationAppService {
  create(req: CreateOrientationRefRequest): Promise<AppServiceResponse<{ id: AggregateID }> | Message>;
  get(req: GetOrientationRefRequest): Promise<AppServiceResponse<OrientationRefDto[]> | Message>;
  orient(req: OrientRequest): Promise<AppServiceResponse<OrientationResultDto> | Message>;
}