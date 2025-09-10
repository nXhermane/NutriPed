/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggregateID, AppServiceResponse, Message, UseCase } from "@shared";
import { IMilkServiceNext } from "../../interfaces";
import {
  CreateMilkRequest,
  CreateMilkResponse,
  GetMilkRequest,
  GetMilkResponse,
} from "../../../useCases/next/milk";

export interface MilkServiceUseCases {
  createMilkUC: UseCase<CreateMilkRequest, CreateMilkResponse>;
  getMilkUC: UseCase<GetMilkRequest, GetMilkResponse>;
}

export class MilkService implements IMilkServiceNext {
  constructor(private readonly ucs: MilkServiceUseCases) {}

  async create(
    req: CreateMilkRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message> {
    const res = await this.ucs.createMilkUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }

  async get(req: GetMilkRequest): Promise<AppServiceResponse<any[]> | Message> {
    const res = await this.ucs.getMilkUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}
