import { AggregateID, AppServiceResponse, Message, UseCase } from "@shared";
import { IAppetiteTestAppService } from "./interfaces";
import {
  CreateAppetiteTestRequest,
  CreateAppetiteTestResponse,
  GetAppetiteTestRequest,
  GetAppetiteTestResponse,
  EvaluateAppetiteRequest,
  EvaluateAppetiteResponse,
  AppetiteTestResultDto,
} from "../useCases";
import { AppetiteTestRefDto } from "../dtos";

export interface AppetiteTestAppServiceUseCases {
  createUC: UseCase<CreateAppetiteTestRequest, CreateAppetiteTestResponse>;
  getUC: UseCase<GetAppetiteTestRequest, GetAppetiteTestResponse>;
  evaluateAppetiteUC: UseCase<
    EvaluateAppetiteRequest,
    EvaluateAppetiteResponse
  >;
}

export class AppetiteTestAppService implements IAppetiteTestAppService {
  constructor(private readonly ucs: AppetiteTestAppServiceUseCases) {}

  async create(
    req: CreateAppetiteTestRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message> {
    const res = await this.ucs.createUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }

  async get(
    req: GetAppetiteTestRequest
  ): Promise<AppServiceResponse<AppetiteTestRefDto> | Message> {
    const res = await this.ucs.getUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }

  async evaluateAppetite(
    req: EvaluateAppetiteRequest
  ): Promise<AppServiceResponse<AppetiteTestResultDto> | Message> {
    const res = await this.ucs.evaluateAppetiteUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}
