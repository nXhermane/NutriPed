import { AppServiceResponse, Message } from "@shared";
import { GetDailyCareRecordRequest } from "../../useCases/next/core/dailyCareRecord";
import { DailyCareRecordDto } from "../../dtos";

export interface IDailyCareRecordService {
  getDailyCareRecord(
    req: GetDailyCareRecordRequest
  ): Promise<AppServiceResponse<DailyCareRecordDto> | Message>;
}
