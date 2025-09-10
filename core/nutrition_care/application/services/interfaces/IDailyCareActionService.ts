import { AppServiceResponse, Message } from "@shared";
import { GetDailyCareActionRequest } from "../../useCases/next/core/dailyCareAction";
import { DailyCareActionDto } from "../../dtos";

export interface IDailyCareActionService {
  getDailyCareAction(
    req: GetDailyCareActionRequest
  ): Promise<AppServiceResponse<DailyCareActionDto> | Message>;
}
