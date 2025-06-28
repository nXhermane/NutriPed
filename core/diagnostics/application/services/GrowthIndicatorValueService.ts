import { AppServiceResponse, Message, UseCase } from "@/core/shared";
import {
  CalculateGrowthIndicatorValueDto,
  CalculateGrowthIndicatorValueRequest,
  CalculateGrowthIndicatorValueResponse,
} from "../useCases";
import { IGrowthIndicatorValueAppService } from "./interfaces";

export interface GrowthIndicatorValueAppServiceUseCases {
  calculateIndicator: UseCase<
    CalculateGrowthIndicatorValueRequest,
    CalculateGrowthIndicatorValueResponse
  >;
}

export class GrowthIndicatorValueAppService
  implements IGrowthIndicatorValueAppService
{
  constructor(private readonly ucs: GrowthIndicatorValueAppServiceUseCases) {}
  async calculateIndicator(
    req: CalculateGrowthIndicatorValueRequest
  ): Promise<AppServiceResponse<CalculateGrowthIndicatorValueDto> | Message> {
    const res = await this.ucs.calculateIndicator.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}
