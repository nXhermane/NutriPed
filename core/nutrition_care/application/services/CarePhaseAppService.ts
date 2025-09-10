import { AggregateID, AppServiceResponse, Message, UseCase } from "@shared";
import { ICarePhaseReferenceAppService } from "./interfaces";
import {
  CreateCarePhaseReferenceRequest,
  CreateCarePhaseReferenceResponse,
  GetCarePhaseReferenceRequest,
  GetCarePhaseReferenceResponse,
} from "../useCases/carePhase";
import { CarePhaseReferenceDto } from "../dtos/carePhase/CarePhaseDto";

export interface CarePhaseReferenceServiceUseCases {
  createUC: UseCase<CreateCarePhaseReferenceRequest, CreateCarePhaseReferenceResponse>;
  getUC: UseCase<GetCarePhaseReferenceRequest, GetCarePhaseReferenceResponse>;
}

export class CarePhaseReferenceAppService implements ICarePhaseReferenceAppService {
  constructor(private readonly ucs: CarePhaseReferenceServiceUseCases) {}

  async create(
    req: CreateCarePhaseReferenceRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message> {
    const res = await this.ucs.createUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }

  async get(
    req: GetCarePhaseReferenceRequest
  ): Promise<AppServiceResponse<CarePhaseReferenceDto[]> | Message> {
    const res = await this.ucs.getUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}
