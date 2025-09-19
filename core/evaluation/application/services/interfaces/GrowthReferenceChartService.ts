import { AggregateID, AppServiceResponse, Message } from "@shared";
import {
  CreateGrowthReferenceChartRequest,
  DeleteGrowthReferenceChartRequest,
  GetGrowthReferenceChartRequest,
  UpdateGrowthReferenceChartRequest,
} from "../../useCases";
import { GrowthReferenceChartDto } from "../../dtos";

export interface IGrowthReferenceChartService {
  create(
    req: CreateGrowthReferenceChartRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message>;
  get(
    req: GetGrowthReferenceChartRequest
  ): Promise<AppServiceResponse<GrowthReferenceChartDto[]> | Message>;
  update(
    req: UpdateGrowthReferenceChartRequest
  ): Promise<AppServiceResponse<GrowthReferenceChartDto> | Message>;
  delete(
    req: DeleteGrowthReferenceChartRequest
  ): Promise<AppServiceResponse<GrowthReferenceChartDto> | Message>;
}
