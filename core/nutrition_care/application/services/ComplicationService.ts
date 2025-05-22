/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggregateID, AppServiceResponse, Message, UseCase } from "@shared";
import { IComplicationAppService } from "./interfaces";
import {
  CreateComplicationRequest,
  CreateComplicationResponse,
  GetComplicationRequest,
  GetComplicationResponse,
} from "../useCases";
import { ComplicationDto } from "../dtos";

export interface ComplicationServiceUseCases {
  createUC: UseCase<CreateComplicationRequest, CreateComplicationResponse>;
  getUC: UseCase<GetComplicationRequest, GetComplicationResponse>;
}

export class ComplicationAppService implements IComplicationAppService {
  constructor(private readonly ucs: ComplicationServiceUseCases) {}

  async create(
    req: CreateComplicationRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message> {
    const res = await this.ucs.createUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }

  async get(
    req: GetComplicationRequest
  ): Promise<AppServiceResponse<ComplicationDto[]> | Message> {
    const res = await this.ucs.getUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}
