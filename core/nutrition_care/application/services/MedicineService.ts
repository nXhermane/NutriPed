/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggregateID, AppServiceResponse, Message, UseCase } from "@shared";
import { IMedicineAppService } from "./interfaces";
import {
  CreateMedicineRequest,
  CreateMedicineResponse,
  GetMedicineRequest,
  GetMedicineResponse,
  GetMedicineDosageRequest,
  GetMedicineDosageResponse,
} from "../useCases";
import { MedicineDto, MedicineDosageResultDto } from "../dtos";

export interface MedicineServiceUseCases {
  createUC: UseCase<CreateMedicineRequest, CreateMedicineResponse>;
  getUC: UseCase<GetMedicineRequest, GetMedicineResponse>;
  getDosageUC: UseCase<GetMedicineDosageRequest, GetMedicineDosageResponse>;
}

export class MedicineAppService implements IMedicineAppService {
  constructor(private readonly ucs: MedicineServiceUseCases) {}

  async create(
    req: CreateMedicineRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message> {
    const res = await this.ucs.createUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }

  async get(
    req: GetMedicineRequest
  ): Promise<AppServiceResponse<MedicineDto[]> | Message> {
    const res = await this.ucs.getUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }

  async getDosage(
    req: GetMedicineDosageRequest
  ): Promise<AppServiceResponse<MedicineDosageResultDto> | Message> {
    const res = await this.ucs.getDosageUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}
