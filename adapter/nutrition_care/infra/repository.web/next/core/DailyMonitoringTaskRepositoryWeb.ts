import { EntityBaseRepositoryWeb } from "@/adapter/shared/repository.web";
import {
  DailyMonitoringTask,
  DailyMonitoringTaskRepository,
} from "@/core/nutrition_care/domain/next/core";
import { DailyMonitoringTaskPersistenceDto } from "../../../dtos/next/core";
import { AggregateID } from "@/core/shared";

export class DailyMonitoringTaskRepositoryWeb
  extends EntityBaseRepositoryWeb<
    DailyMonitoringTask,
    DailyMonitoringTaskPersistenceDto
  >
  implements DailyMonitoringTaskRepository
{
  protected storeName = "daily_monitoring_tasks";

  getById(id: AggregateID): Promise<DailyMonitoringTask> {
    throw new Error("Method not implemented.");
  }
  save(entity: DailyMonitoringTask, trx?: any): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(id: AggregateID, trx?: any): Promise<void> {
    throw new Error("Method not implemented.");
  }

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
