import { AggregateID, AppServiceResponse, Message, UseCase } from "@shared";
import {
  ConvertUnitRequest,
  ConvertUnitResponse,
  CreateUnitRequest,
  CreateUnitResponse,
  DeleteUnitRequest,
  DeleteUnitResponse,
  GetUnitRequest,
  GetUnitResponse,
  UpdateUnitRequest,
  UpdateUnitResponse,
} from "../useCases";
import { IUnitService } from "./interfaces";
import { UnitDto } from "../dtos";

export interface UnitServiceUseCases {
  createUC: UseCase<CreateUnitRequest, CreateUnitResponse>;
  getUC: UseCase<GetUnitRequest, GetUnitResponse>;
  updateUC: UseCase<UpdateUnitRequest, UpdateUnitResponse>;
  deleteUC: UseCase<DeleteUnitRequest, DeleteUnitResponse>;
  convertUC: UseCase<ConvertUnitRequest, ConvertUnitResponse>;
}

export class UnitService implements IUnitService {
  constructor(private readonly ucs: UnitServiceUseCases) {}
  async create(
    req: CreateUnitRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message> {
    const res = await this.ucs.createUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
  async get(
    req: GetUnitRequest
  ): Promise<AppServiceResponse<UnitDto[]> | Message> {
    const res = await this.ucs.getUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
  async update(
    req: UpdateUnitRequest
  ): Promise<AppServiceResponse<boolean> | Message> {
    const res = await this.ucs.updateUC.execute(req);
    if (res.isRight()) return { data: true };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
  async delete(
    req: DeleteUnitRequest
  ): Promise<AppServiceResponse<boolean> | Message> {
    const res = await this.ucs.deleteUC.execute(req);
    if (res.isRight()) return { data: true };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
  async convert(
    req: ConvertUnitRequest
  ): Promise<AppServiceResponse<{ code: string; value: number }> | Message> {
    const res = await this.ucs.convertUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}
