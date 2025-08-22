import { AggregateID, AppServiceResponse, Message, UseCase } from "@shared";
import {
  CreateClinicalSignReferenceRequest,
  CreateClinicalSignReferenceResponse,
  DeleteClinicalSignReferenceRequest,
  DeleteClinicalSignReferenceResponse,
  GetClinicalSignReferenceRequest,
  GetClinicalSignReferenceResponse,
  UpdateClinicalSignReferenceRequest,
  UpdateClinicalSignReferenceResponse,
} from "../useCases";
import { IClinicalSignReferenceService } from "./interfaces";
import { ClinicalSignReferenceDto } from "../dtos";

export interface ClinicalSignReferenceServiceUseCases {
  createUC: UseCase<
    CreateClinicalSignReferenceRequest,
    CreateClinicalSignReferenceResponse
  >;
  getUC: UseCase<
    GetClinicalSignReferenceRequest,
    GetClinicalSignReferenceResponse
  >;
  updateUC: UseCase<
    UpdateClinicalSignReferenceRequest,
    UpdateClinicalSignReferenceResponse
  >;
  deleteUC: UseCase<
    DeleteClinicalSignReferenceRequest,
    DeleteClinicalSignReferenceResponse
  >;
}
export class ClinicalSignReferenceService
  implements IClinicalSignReferenceService
{
  constructor(private readonly ucs: ClinicalSignReferenceServiceUseCases) {}
  async create(
    req: CreateClinicalSignReferenceRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message> {
    const res = await this.ucs.createUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
  async get(
    req: GetClinicalSignReferenceRequest
  ): Promise<AppServiceResponse<ClinicalSignReferenceDto[]> | Message> {
    const res = await this.ucs.getUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
  async update(
    req: UpdateClinicalSignReferenceRequest
  ): Promise<AppServiceResponse<ClinicalSignReferenceDto> | Message> {
    const res = await this.ucs.updateUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
  async delete(
    req: DeleteClinicalSignReferenceRequest
  ): Promise<AppServiceResponse<ClinicalSignReferenceDto> | Message> {
    const res = await this.ucs.deleteUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}
