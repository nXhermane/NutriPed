import { AppServiceResponse, Message } from "@shared";
import {
  CalculateAllAvailableGrowthIndicatorValueRequest,
  CalculateGrowthIndicatorValueDto,
  CalculateGrowthIndicatorValueRequest,
} from "../../useCases";
import { GrowthIndicatorValueDto } from "../../dtos";

export interface IGrowthIndicatorValueAppService {
  calculateIndicator(
    req: CalculateGrowthIndicatorValueRequest
  ): Promise<AppServiceResponse<CalculateGrowthIndicatorValueDto> | Message>;
  calculateAllAvailableIndicator(
    req: CalculateAllAvailableGrowthIndicatorValueRequest
  ): Promise<AppServiceResponse<GrowthIndicatorValueDto[]> | Message>;
}
