import { AggregateID, AppServiceResponse, Message } from "@shared";
import {
  CreateNutritionalProductRequest,
  EvaluateNutritionalProductRequest,
  GetNutritionalProductDosageRequest,
  GetNutritionalProductRequest,
} from "../../useCases/next/nutritional_products";
import { NutritionalProductDosageDto } from "../../dtos/next";

export interface INutritionalProductServiceNext {
  create(
    req: CreateNutritionalProductRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message>;

  get(
    req: GetNutritionalProductRequest
  ): Promise<AppServiceResponse<any[]> | Message>;
  evaluate(
    req: EvaluateNutritionalProductRequest
  ): Promise<AppServiceResponse<NutritionalProductDosageDto> | Message>;
  getDosage(
    req: GetNutritionalProductDosageRequest
  ): Promise<AppServiceResponse<NutritionalProductDosageDto> | Message>;
}
