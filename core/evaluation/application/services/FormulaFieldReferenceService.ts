import {
  AggregateID,
  AppServiceResponse,
  Message,
  UseCase,
} from "@/core/shared";
import {
  CreateFormulaFieldReferenceRequest,
  CreateFormulaFieldReferenceResponse,
  GetFormulaFieldReferenceRequest,
  GetFormulaFieldReferenceResponse,
} from "../useCases";
import { IFormulaFieldReferenceService } from "./interfaces";
import { FormulaFieldReferenceDto } from "../dtos";

export interface FormulaFieldReferenceUseCases {
  createUC: UseCase<
    CreateFormulaFieldReferenceRequest,
    CreateFormulaFieldReferenceResponse
  >;
  getUC: UseCase<
    GetFormulaFieldReferenceRequest,
    GetFormulaFieldReferenceResponse
  >;
}

export class FormulaFieldReferenceService
  implements IFormulaFieldReferenceService
{
  constructor(private readonly ucs: FormulaFieldReferenceUseCases) {}
  async create(
    req: CreateFormulaFieldReferenceRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message> {
    const res = await this.ucs.createUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any).err));
  }
  async get(
    req: GetFormulaFieldReferenceRequest
  ): Promise<AppServiceResponse<FormulaFieldReferenceDto[]> | Message> {
    const res = await this.ucs.getUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any).err));
  }
}
