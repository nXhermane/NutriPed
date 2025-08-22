import { AggregateID, AppServiceResponse, Message, UseCase } from "@shared";
import {
  CreateAnthropometricMeasureRequest,
  CreateAnthropometricMeasureResponse,
  DeleteAnthropometricMeasureRequest,
  DeleteAnthropometricMeasureResponse,
  GetAnthropometricMeasureRequest,
  GetAnthropometricMeasureResponse,
  UpdateAnthropometricMeasureRequest,
  UpdateAnthropometricMeasureResponse,
} from "../useCases";
import { IAnthropometricMeasureService } from "./interfaces";
import { AnthropometricMeasureDto } from "../dtos";

export interface AnthropometricMeasureServiceUseCases {
  createUC: UseCase<
    CreateAnthropometricMeasureRequest,
    CreateAnthropometricMeasureResponse
  >;
  deleteUC: UseCase<
    DeleteAnthropometricMeasureRequest,
    DeleteAnthropometricMeasureResponse
  >;
  updateUC: UseCase<
    UpdateAnthropometricMeasureRequest,
    UpdateAnthropometricMeasureResponse
  >;
  getUC: UseCase<
    GetAnthropometricMeasureRequest,
    GetAnthropometricMeasureResponse
  >;
}
export class AnthropometricMeasureService
  implements IAnthropometricMeasureService
{
  constructor(private readonly ucs: AnthropometricMeasureServiceUseCases) {}
  async create(
    req: CreateAnthropometricMeasureRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message> {
    const res = await this.ucs.createUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify(res.value.err));
  }
  async get(
    req: GetAnthropometricMeasureRequest
  ): Promise<AppServiceResponse<AnthropometricMeasureDto[]> | Message> {
    const res = await this.ucs.getUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
  async update(
    req: UpdateAnthropometricMeasureRequest
  ): Promise<AppServiceResponse<AnthropometricMeasureDto> | Message> {
    const res = await this.ucs.updateUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
  async delete(
    req: DeleteAnthropometricMeasureRequest
  ): Promise<AppServiceResponse<AnthropometricMeasureDto> | Message> {
    const res = await this.ucs.deleteUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}
