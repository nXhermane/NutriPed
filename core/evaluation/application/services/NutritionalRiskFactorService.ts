import { AggregateID, AppServiceResponse, Message, UseCase } from "@shared";
import {
  CreateNutritionalRiskFactorRequest,
  CreateNutritionalRiskFactorResponse,
  DeleteNutritionalRiskFactorRequest,
  DeleteNutritionalRiskFactorResponse,
  GetNutritionalRiskFactorRequest,
  GetNutritionalRiskFactorResponse,
  UpdateNutritionalRiskFactorRequest,
  UpdateNutritionalRiskFactorResponse,
} from "../useCases";
import { INutritionalRiskFactorService } from "./interfaces";
import { NutritionalRiskFactorDto } from "../dtos";

export interface NutritionalRiskFactorServiceUseCases {
  createUC: UseCase<
    CreateNutritionalRiskFactorRequest,
    CreateNutritionalRiskFactorResponse
  >;
  getUC: UseCase<
    GetNutritionalRiskFactorRequest,
    GetNutritionalRiskFactorResponse
  >;
  updateUC: UseCase<
    UpdateNutritionalRiskFactorRequest,
    UpdateNutritionalRiskFactorResponse
  >;
  deleteUC: UseCase<
    DeleteNutritionalRiskFactorRequest,
    DeleteNutritionalRiskFactorResponse
  >;
}
export class NutritionalRiskFactorService
  implements INutritionalRiskFactorService
{
  constructor(private readonly ucs: NutritionalRiskFactorServiceUseCases) {}
  async get(
    req: GetNutritionalRiskFactorRequest
  ): Promise<AppServiceResponse<NutritionalRiskFactorDto[]> | Message> {
    const res = await this.ucs.getUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
  async update(
    req: UpdateNutritionalRiskFactorRequest
  ): Promise<AppServiceResponse<NutritionalRiskFactorDto> | Message> {
    const res = await this.ucs.updateUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
  async delete(
    req: DeleteNutritionalRiskFactorRequest
  ): Promise<AppServiceResponse<NutritionalRiskFactorDto> | Message> {
    const res = await this.ucs.deleteUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
  async create(
    req: CreateNutritionalRiskFactorRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message> {
    const res = await this.ucs.createUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}
