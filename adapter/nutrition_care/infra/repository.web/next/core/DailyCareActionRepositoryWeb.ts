import { EntityBaseRepositoryWeb } from "@/adapter/shared/repository.web";
import {
  DailyCareAction,
  DailyCareActionRepository,
} from "@/core/nutrition_care/domain/next/core";
import { DailyCareActionPersistenceDto } from "../../../dtos/next/core";
import { AggregateID } from "@/core/shared";

export class DailyCareActionRepositoryWeb
  extends EntityBaseRepositoryWeb<
    DailyCareAction,
    DailyCareActionPersistenceDto
  >
  implements DailyCareActionRepository
{
  protected storeName = "daily_care_actions";

  async exist(id: AggregateID): Promise<boolean> {
    try {
      const store = await this.getObjectStore();
      return new Promise((resolve, reject) => {
        const request = store.index("id").get(id.toString());

        request.onsuccess = event => {
          const result = (event.target as IDBRequest).result;
          resolve(!!result);
        };

        request.onerror = event => {
          console.error("Error checking existence:", event);
          reject(new Error("Failed to check entity existence"));
        };
      });
    } catch (error) {
      console.error(error);
      throw new Error(error as string);
    }
  }
}
