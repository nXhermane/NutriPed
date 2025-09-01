import {
  AggregateID,
  AppServiceResponse,
  Message,
  UseCase,
} from "@/core/shared";
import {
  CreateFormulaFieldRefRequest,
  CreateFormulaFieldRefResponse,
  GetFormulaFieldRefRequest,
  GetFormulaFieldRefResponse,
} from "../useCases";
import { IFormulaFieldReferenceService } from "./interfaces";
import { FormulaFieldReferenceDto } from "../dtos";

export interface FormulaFieldReferenceUseCases {
  createUC: UseCase<CreateFormulaFieldRefRequest, CreateFormulaFieldRefResponse>;
  getUC: UseCase<GetFormulaFieldRefRequest, GetFormulaFieldRefResponse>;
}

export class FormulaFieldReferenceService
  implements IFormulaFieldReferenceService
{
  constructor(private readonly ucs: FormulaFieldReferenceUseCases) {}
  async create(
    req: CreateFormulaFieldRefRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message> {
    const res = await this.ucs.createUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any).err));
  }
  async get(
    req: GetFormulaFieldRefRequest
  ): Promise<AppServiceResponse<FormulaFieldReferenceDto[]> | Message> {
    const res = await this.ucs.getUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any).err));
  }
}
