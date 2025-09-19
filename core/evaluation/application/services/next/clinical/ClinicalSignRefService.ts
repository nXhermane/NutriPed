import {
  AggregateID,
  AppServiceResponse,
  Message,
  UseCase,
} from "@/core/shared";
import { NextClinicalUseCase } from "../../../useCases/next";
import { IClinicalSignRefService } from "./interfaces";
import { ClinicalSignReferenceDto } from "../../../dtos/next/clinical";

export interface ClinicalSignRefServiceUseCases {
  createUC: UseCase<
    NextClinicalUseCase.CreateClinicalSignReferenceRequest,
    NextClinicalUseCase.CreateClinicalSignReferenceResponse
  >;
  getUC: UseCase<
    NextClinicalUseCase.GetClinicalSignReferenceRequest,
    NextClinicalUseCase.GetClinicalSignReferenceResponse
  >;
}

export class ClinicalSignRefService implements IClinicalSignRefService {
  constructor(private readonly ucs: ClinicalSignRefServiceUseCases) {}
  async create(
    req: NextClinicalUseCase.CreateClinicalSignReferenceRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message> {
    const res = await this.ucs.createUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any).err));
  }
  async get(
    req: NextClinicalUseCase.GetClinicalSignReferenceRequest
  ): Promise<AppServiceResponse<ClinicalSignReferenceDto[]> | Message> {
    const res = await this.ucs.getUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any).err));
  }
}
