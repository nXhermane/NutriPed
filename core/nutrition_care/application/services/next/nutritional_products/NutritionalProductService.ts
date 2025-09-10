/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggregateID, AppServiceResponse, Message, UseCase } from "@shared";
import { INutritionalProductServiceNext } from "../../interfaces";
import {
  CreateNutritionalProductRequest,
  CreateNutritionalProductResponse,
  EvaluateNutritionalProductRequest,
  EvaluateNutritionalProductResponse,
  GetNutritionalProductDosageRequest,
  GetNutritionalProductDosageResponse,
  GetNutritionalProductRequest,
  GetNutritionalProductResponse,
} from "../../../useCases/next/nutritional_products";
import { NutritionalProductDosageDto } from "../../../dtos/next";

export interface NutritionalProductServiceUseCases {
  createNutritionalProductUC: UseCase<
    CreateNutritionalProductRequest,
    CreateNutritionalProductResponse
  >;
  getNutritionalProductUC: UseCase<
    GetNutritionalProductRequest,
    GetNutritionalProductResponse
  >;
  evaluateNutritionalProductUC: UseCase<
    EvaluateNutritionalProductRequest,
    EvaluateNutritionalProductResponse
  >;
  getNutritionalProductDosageUC: UseCase<
    GetNutritionalProductDosageRequest,
    GetNutritionalProductDosageResponse
  >;
}

export class NutritionalProductService
  implements INutritionalProductServiceNext
{
  constructor(private readonly ucs: NutritionalProductServiceUseCases) {}

  async create(
    req: CreateNutritionalProductRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message> {
    const res = await this.ucs.createNutritionalProductUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }

  async get(
    req: GetNutritionalProductRequest
  ): Promise<AppServiceResponse<any[]> | Message> {
    const res = await this.ucs.getNutritionalProductUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
  async evaluate(
    req: EvaluateNutritionalProductRequest
  ): Promise<AppServiceResponse<NutritionalProductDosageDto> | Message> {
    const res = await this.ucs.evaluateNutritionalProductUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
  async getDosage(
    req: GetNutritionalProductDosageRequest
  ): Promise<AppServiceResponse<NutritionalProductDosageDto> | Message> {
    const res = await this.ucs.getNutritionalProductDosageUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}
