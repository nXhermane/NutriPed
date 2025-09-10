/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppServiceResponse, Message, UseCase } from "@shared";
import { IDailyCareRecordService } from "../../interfaces";
import {
  GetDailyCareRecordRequest,
  GetDailyCareRecordResponse,
} from "../../../useCases/next/core/dailyCareRecord";
import { DailyCareRecordDto } from "../../../dtos";

export interface DailyCareRecordServiceUseCases {
  getDailyCareRecordUC: UseCase<
    GetDailyCareRecordRequest,
    GetDailyCareRecordResponse
  >;
}

export class DailyCareRecordService implements IDailyCareRecordService {
  constructor(private readonly ucs: DailyCareRecordServiceUseCases) {}

  async getDailyCareRecord(
    req: GetDailyCareRecordRequest
  ): Promise<AppServiceResponse<DailyCareRecordDto> | Message> {
    const res = await this.ucs.getDailyCareRecordUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}
