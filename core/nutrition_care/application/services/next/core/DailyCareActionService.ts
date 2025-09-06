/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppServiceResponse, Message, UseCase } from "@shared";
import { IDailyCareActionService } from "../../interfaces";
import {
  GetDailyCareActionRequest,
  GetDailyCareActionResponse,
} from "../../../useCases/next/core/dailyCareAction";
import { DailyCareActionDto } from "../../../dtos";

export interface DailyCareActionServiceUseCases {
  getDailyCareActionUC: UseCase<
    GetDailyCareActionRequest,
    GetDailyCareActionResponse
  >;
}

export class DailyCareActionService implements IDailyCareActionService {
  constructor(private readonly ucs: DailyCareActionServiceUseCases) {}

  async getDailyCareAction(
    req: GetDailyCareActionRequest
  ): Promise<AppServiceResponse<DailyCareActionDto> | Message> {
    const res = await this.ucs.getDailyCareActionUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}
