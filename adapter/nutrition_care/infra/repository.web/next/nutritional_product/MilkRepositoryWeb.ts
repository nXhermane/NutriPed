import { EntityBaseRepositoryWeb } from "@/adapter/shared/repository.web";
import { Milk } from "@/core/nutrition_care/domain/modules/next/nutritional_product/models";
import { MilkRepository } from "@/core/nutrition_care/domain/modules/next/nutritional_product/ports/secondary/repositories";
import { MilkPersistenceDto } from "../../../dtos/next/nutritional_product";
import { SystemCode } from "@/core/shared";
import { MilkType } from "@/core/constants";

export class MilkRepositoryWeb
  extends EntityBaseRepositoryWeb<Milk, MilkPersistenceDto>
  implements MilkRepository
{
  protected storeName = "next_milks";

  async getByCode(code: SystemCode<MilkType>): Promise<Milk> {
    try {
      const store = await this.getObjectStore();
      return new Promise((resolve, reject) => {
        const request = store.index("code").get(code.unpack());

        request.onsuccess = event => {
          const result = (event.target as IDBRequest).result;
          if (!result) {
            reject(new Error("Milk not found"));
            return;
          }
          resolve(this.mapper.toDomain(result as MilkPersistenceDto));
        };

        request.onerror = event => {
          console.error("Error fetching by code:", event);
          reject(new Error("Failed to fetch Milk"));
        };
      });
    } catch (error) {
      console.error(error);
      throw new Error(error as string);
    }
  }

  async exist(code: SystemCode<MilkType>): Promise<boolean> {
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
          reject(new Error("Failed to check Milk existence"));
        };
      });
    } catch (error) {
      console.error(error);
      throw new Error(error as string);
    }
  }
}
