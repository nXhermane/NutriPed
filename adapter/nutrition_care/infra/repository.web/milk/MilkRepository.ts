import { Milk, MilkRepository, MilkType } from "@core/nutrition_care";
import { SystemCode } from "@shared";
import { EntityBaseRepositoryWeb } from "../../../../shared";
import { MilkPersistenceDto } from "../../dtos";

export class MilkRepositoryWebImpl
  extends EntityBaseRepositoryWeb<Milk, MilkPersistenceDto>
  implements MilkRepository
{
  protected storeName = "milks";

  async getByType(type: MilkType): Promise<Milk> {
    try {
      const store = await this.getObjectStore();
      return new Promise((resolve, reject) => {
        const request = store.index("type").get(type);

        request.onsuccess = event => {
          const result = (event.target as IDBRequest).result;
          if (!result) {
            reject(new Error(`Milk with type ${type} not found`));
            return;
          }
          resolve(this.mapper.toDomain(result as MilkPersistenceDto));
        };

        request.onerror = event => {
          console.error("Error fetching milk by type:", event);
          reject(new Error("Failed to fetch milk"));
        };
      });
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to get milk by type: ${error}`);
    }
  }
  async exist(code: SystemCode): Promise<boolean> {
    try {
      const store = await this.getObjectStore();
      return new Promise((resolve, reject) => {
        const request = store.index("code").count(code.unpack());

        request.onsuccess = event => {
          const count = (event.target as IDBRequest).result;
          resolve(count > 0);
        };

        request.onerror = event => {
          console.error("Error checking existence:", event);
          reject(new Error("Failed to check milk existence"));
        };
      });
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to check milk existence: ${error}`);
    }
  }
}
