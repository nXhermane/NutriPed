import { AggregateID, AppServiceResponse, Message, UseCase } from "@shared";
import {
  CreatePatientRequest,
  CreatePatientResponse,
  DeletePatientRequest,
  DeletePatientResponse,
  GetPatientRequest,
  GetPatientResponse,
  UpdatePatientRequest,
  UpdatePatientResponse,
} from "../useCases";
import { IPatientService } from "./interfaces";
import { PatientDto } from "../dtos";

export interface PatientServiceUseCases {
  createUC: UseCase<CreatePatientRequest, CreatePatientResponse>;
  getUC: UseCase<GetPatientRequest, GetPatientResponse>;
  updateUC: UseCase<UpdatePatientRequest, UpdatePatientResponse>;
  deleteUC: UseCase<DeletePatientRequest, DeletePatientResponse>;
}
export class PatientService implements IPatientService {
  constructor(private readonly ucs: PatientServiceUseCases) {}
  async create(
    req: CreatePatientRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message> {
    const res = await this.ucs.createUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
  async get(
    req: GetPatientRequest
  ): Promise<AppServiceResponse<PatientDto[]> | Message> {
    const res = await this.ucs.getUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
  async update(
    req: UpdatePatientRequest
  ): Promise<AppServiceResponse<boolean> | Message> {
    const res = await this.ucs.updateUC.execute(req);
    if (res.isRight()) return { data: true };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
  async delete(
    req: DeletePatientRequest
  ): Promise<AppServiceResponse<boolean> | Message> {
    const res = await this.ucs.deleteUC.execute(req);
    if (res.isRight()) return { data: true };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}
