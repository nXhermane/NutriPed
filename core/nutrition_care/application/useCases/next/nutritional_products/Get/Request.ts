import { NUTRITIONAL_PRODUCT_CODE } from "@/core/constants";
import { AggregateID } from "@/core/shared";

export interface GetNutritionalProductRequest {
  code?: NUTRITIONAL_PRODUCT_CODE;
  id?: AggregateID;
}
