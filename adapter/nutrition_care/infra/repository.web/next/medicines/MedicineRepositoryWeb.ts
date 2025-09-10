import { EntityBaseRepositoryWeb } from "@/adapter/shared/repository.web";
import {
  Medicine,
  MedicineRepository,
} from "../../../../../core/nutrition_care/domain/modules/next/medicines/models";
import { MedicinePersistenceDto } from "../../../dtos/next/medicines/MedicinePersistenceDto";
import { SystemCode } from "@/core/shared";

export class MedicineRepositoryWeb
  extends EntityBaseRepositoryWeb<Medicine, MedicinePersistenceDto>
  implements MedicineRepository
{
  protected storeName = "next_medicines";

  public async exist(code: SystemCode): Promise<boolean> {
    return this.exists(code);
  }

  async getByCode(code: SystemCode): Promise<Medicine> {
    try {
      const store = await this.getObjectStore();
      return new Promise((resolve, reject) => {
        const request = store.index("code").get(code.unpack());

        request.onsuccess = event => {
          const result = (event.target as IDBRequest).result;
          if (!result) {
            reject(new Error("Entity Not found"));
            return;
          }
          resolve(this.mapper.toDomain(result as MedicinePersistenceDto));
        };

        request.onerror = event => {
          console.error("Error fetching by code:", event);
          reject(new Error("Failed to fetch entity"));
        };
      });
    } catch (error) {
      console.error(error);
      throw new Error(error as string);
    }
  }
}
