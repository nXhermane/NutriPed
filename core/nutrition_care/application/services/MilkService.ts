/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggregateID, AppServiceResponse, Message, UseCase } from "@shared";
import { IMilkAppService } from "./interfaces";
import {
  CreateMilkRequest,
  CreateMilkResponse,
  GetMilkRequest,
  GetMilkResponse,
  SuggestMilkRequest,
  SuggestMilkResponse
} from "../useCases";
import { MilkDto, MilkSuggestionResultDto } from "../dtos";

export interface MilkServiceUseCases {
  createUC: UseCase<CreateMilkRequest, CreateMilkResponse>;
  getUC: UseCase<GetMilkRequest, GetMilkResponse>;
  suggestMilkUC: UseCase<SuggestMilkRequest, SuggestMilkResponse>;
}

export class MilkAppService implements IMilkAppService {
  constructor(private readonly ucs: MilkServiceUseCases) {}

  async create(req: CreateMilkRequest): Promise<AppServiceResponse<{ id: AggregateID }> | Message> {
    const res = await this.ucs.createUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }

  async get(req: GetMilkRequest): Promise<AppServiceResponse<MilkDto[]> | Message> {
    const res = await this.ucs.getUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }

  async suggestMilk(req: SuggestMilkRequest): Promise<AppServiceResponse<MilkSuggestionResultDto> | Message> {
    const res = await this.ucs.suggestMilkUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}