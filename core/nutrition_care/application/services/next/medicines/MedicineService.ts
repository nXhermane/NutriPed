/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggregateID, AppServiceResponse, Message, UseCase } from "@shared";
import { IMedicineServiceNext } from "../../interfaces";
import {
  CreateMedicineRequest,
  CreateMedicineResponse,
  GetMedicineRequest,
  GetMedicineResponse,
  GetMedicineDosageRequest,
  GetMedicineDosageResponse,
} from "../../../useCases/next/medicines";

export interface MedicineServiceUseCases {
  createMedicineUC: UseCase<
    CreateMedicineRequest,
    CreateMedicineResponse
  >;
  getMedicineUC: UseCase<
    GetMedicineRequest,
    GetMedicineResponse
  >;
  getMedicineDosageUC: UseCase<
    GetMedicineDosageRequest,
    GetMedicineDosageResponse
  >;
}

export class MedicineService implements IMedicineServiceNext {
  constructor(private readonly ucs: MedicineServiceUseCases) {}

  async create(
    req: CreateMedicineRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message> {
    const res = await this.ucs.createMedicineUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }

  async get(
    req: GetMedicineRequest
  ): Promise<AppServiceResponse<any[]> | Message> {
    const res = await this.ucs.getMedicineUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }

  async getDosage(
    req: GetMedicineDosageRequest
  ): Promise<AppServiceResponse<any> | Message> {
    const res = await this.ucs.getMedicineDosageUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}
