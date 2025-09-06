import { AggregateID, AppServiceResponse, Message } from "@shared";
import {
  CreateNutritionalProductRequest,
  GetNutritionalProductRequest,
} from "../../useCases/next/nutritional_products";

export interface INutritionalProductServiceNext {
  create(
    req: CreateNutritionalProductRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message>;

  get(
    req: GetNutritionalProductRequest
  ): Promise<AppServiceResponse<any[]> | Message>;
}
