import { Repository, SystemCode } from "@/core/shared";
import { NutritionalProduct } from "../../../models";
import { NUTRITIONAL_PRODUCT_CODE } from "@/core/constants";
export interface NutritionalProductRepository
  extends Repository<NutritionalProduct> {
  getAll(): Promise<NutritionalProduct[]>;
  getByCode(
    code: SystemCode<NUTRITIONAL_PRODUCT_CODE>
  ): Promise<NutritionalProduct>;
  exist(
    code: SystemCode<NUTRITIONAL_PRODUCT_CODE>
  ): Promise<boolean>;
}
