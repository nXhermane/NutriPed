/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggregateID, AppServiceResponse, Message, UseCase } from "@shared";
import { IOrientationAppService } from "./interfaces";
import {
  CreateOrientationRefRequest,
  CreateOrientationRefResponse,
  GetOrientationRefRequest,
  GetOrientationRefResponse,
  OrientationResultDto,
  OrientRequest,
  OrientResponse
} from "../useCases";
import { OrientationRefDto } from "../dtos";

export interface OrientationServiceUseCases {
  createUC: UseCase<CreateOrientationRefRequest, CreateOrientationRefResponse>;
  getUC: UseCase<GetOrientationRefRequest, GetOrientationRefResponse>;
  orientUC: UseCase<OrientRequest, OrientResponse>;
}

export class OrientationAppService implements IOrientationAppService {
  constructor(private readonly ucs: OrientationServiceUseCases) {}

  async create(req: CreateOrientationRefRequest): Promise<AppServiceResponse<{ id: AggregateID }> | Message> {
    const res = await this.ucs.createUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }

  async get(req: GetOrientationRefRequest): Promise<AppServiceResponse<OrientationRefDto[]> | Message> {
    const res = await this.ucs.getUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }

  async orient(req: OrientRequest): Promise<AppServiceResponse<OrientationResultDto> | Message> {
    const res = await this.ucs.orientUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}