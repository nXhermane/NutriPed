import { AppServiceResponse, Message } from "@shared";
import {
  CalculateGrowthIndicatorValueDto,
  CalculateGrowthIndicatorValueRequest,
} from "../../useCases";

export interface IGrowthIndicatorValueAppService {
  calculateIndicator(
    req: CalculateGrowthIndicatorValueRequest
  ): Promise<AppServiceResponse<CalculateGrowthIndicatorValueDto> | Message>;
}
