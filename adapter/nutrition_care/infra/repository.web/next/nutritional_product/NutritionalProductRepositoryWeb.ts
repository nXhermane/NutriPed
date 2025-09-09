import { EntityBaseRepositoryWeb } from "@/adapter/shared/repository.web";
import { NutritionalProduct } from "@/core/nutrition_care/domain/modules/next/nutritional_product/models";
import { NutritionalProductRepository } from "@/core/nutrition_care/domain/modules/next/nutritional_product/ports/secondary/repositories";
import { NutritionalProductPersistenceDto } from "../../../dtos/next/nutritional_product";
import { SystemCode } from "@/core/shared";
import { NUTRITIONAL_PRODUCT_CODE } from "@/core/constants";

export class NutritionalProductRepositoryWeb
  extends EntityBaseRepositoryWeb<
    NutritionalProduct,
    NutritionalProductPersistenceDto
  >
  implements NutritionalProductRepository
{
  protected storeName = "next_nutritional_products";

  async getByCode(
    code: SystemCode<NUTRITIONAL_PRODUCT_CODE>
  ): Promise<NutritionalProduct> {
    try {
      const store = await this.getObjectStore();
      return new Promise((resolve, reject) => {
        const request = store.index("code").get(code.unpack());

        request.onsuccess = event => {
          const result = (event.target as IDBRequest).result;
          if (!result) {
            reject(new Error("NutritionalProduct not found"));
            return;
          }
          resolve(
            this.mapper.toDomain(result as NutritionalProductPersistenceDto)
          );
        };

        request.onerror = event => {
          console.error("Error fetching by code:", event);
          reject(new Error("Failed to fetch NutritionalProduct"));
        };
      });
    } catch (error) {
      console.error(error);
      throw new Error(error as string);
    }
  }

  async exist(code: SystemCode<NUTRITIONAL_PRODUCT_CODE>): Promise<boolean> {
    try {
      const store = await this.getObjectStore();
      return new Promise((resolve, reject) => {
        const request = store.index("code").get(code.unpack());

        request.onsuccess = event => {
          const result = (event.target as IDBRequest).result;
          resolve(!!result);
        };

        request.onerror = event => {
          console.error("Error checking existence:", event);
          reject(new Error("Failed to check NutritionalProduct existence"));
        };
      });
    } catch (error) {
      console.error(error);
      throw new Error(error as string);
    }
  }
}
