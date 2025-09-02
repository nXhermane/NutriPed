import { AggregateID, AppServiceResponse, Message, UseCase } from "@shared";
import { IMedicineAppService } from "./interfaces/IMedicineAppService";
import {
  CreateMedicineRequest,
  CreateMedicineResponse,
  GetMedicineRequest,
  GetMedicineResponse,
  GetMedicineDosageRequest,
  GetMedicineDosageResponse,
} from "../../../useCases/next/medicines";
import { MedicineDto, MedicationDosageResultDto } from "../../../../dtos/next/medicines";

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
  ): Promise<AppServiceResponse<MedicationDosageResultDto> | Message> {
    const res = await this.ucs.getDosageUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}
