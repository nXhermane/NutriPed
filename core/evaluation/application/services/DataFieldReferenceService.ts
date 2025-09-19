import {
  AggregateID,
  AppServiceResponse,
  Message,
  UseCase,
} from "@/core/shared";
import {
  CreateDataFieldRefRequest,
  CreateDataFieldRefResponse,
  GetDataFieldRefRequest,
  GetDataFieldRefResponse,
  ValidateDataFieldResponseRequest,
  ValidateDataFieldResponseResponse,
} from "../useCases";
import { IDataFieldReferenceService } from "./interfaces";
import { DataFieldReferenceDto } from "../dtos";

export interface DataFieldReferenceUseCases {
  createUC: UseCase<CreateDataFieldRefRequest, CreateDataFieldRefResponse>;
  getUC: UseCase<GetDataFieldRefRequest, GetDataFieldRefResponse>;
  validationUC: UseCase<
    ValidateDataFieldResponseRequest,
    ValidateDataFieldResponseResponse
  >;
}

export class DataFieldReferenceService implements IDataFieldReferenceService {
  constructor(private readonly ucs: DataFieldReferenceUseCases) {}
  async create(
    req: CreateDataFieldRefRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message> {
    const res = await this.ucs.createUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any).err));
  }
  async get(
    req: GetDataFieldRefRequest
  ): Promise<AppServiceResponse<DataFieldReferenceDto[]> | Message> {
    const res = await this.ucs.getUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any).err));
  }
  async validate(
    req: ValidateDataFieldResponseRequest
  ): Promise<AppServiceResponse<boolean> | Message> {
    const res = await this.ucs.validationUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any).err));
  }
}
