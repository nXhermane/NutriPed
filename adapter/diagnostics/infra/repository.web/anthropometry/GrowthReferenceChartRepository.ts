import {
  GrowthReferenceChart,
  GrowthReferenceChartRepository,
} from "@core/diagnostics";
import { SystemCode } from "@shared";
import { EntityBaseRepositoryWeb } from "../../../../shared";
import { GrowthReferenceChartPersistenceDto } from "../../dtos";

export class GrowthReferenceChartRepositoryWebImpl
  extends EntityBaseRepositoryWeb<
    GrowthReferenceChart,
    GrowthReferenceChartPersistenceDto
  >
  implements GrowthReferenceChartRepository
{
  protected storeName = "growth_reference_charts";

  async getByCode(code: SystemCode): Promise<GrowthReferenceChart> {
    try {
      const store = await this.getObjectStore();
      return new Promise((resolve, reject) => {
        const request = store.index("code").get(code.unpack());

        request.onsuccess = event => {
          const result = (event.target as IDBRequest).result;
          if (!result) {
            reject(
              new Error(
                `GrowthReferenceChart with code ${code.unpack()} not found`
              )
            );
            return;
          }
          resolve(
            this.mapper.toDomain(result as GrowthReferenceChartPersistenceDto)
          );
        };

        request.onerror = event => {
          console.error(
            "Error fetching growth reference chart by code:",
            event
          );
          reject(new Error("Failed to fetch growth reference chart"));
        };
      });
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to get growth reference chart by code: ${error}`);
    }
  }

  async getAllCode(): Promise<SystemCode[]> {
    try {
      const store = await this.getObjectStore();
      return new Promise((resolve, reject) => {
        const request = store.index("code").getAllKeys();

        request.onsuccess = event => {
          const results = (event.target as IDBRequest).result;
          if (!results) {
            resolve([]);
            return;
          }
          const codes = results.map(
            (code: string) => SystemCode.create(code).val
          );
          resolve(codes);
        };

        request.onerror = event => {
          console.error("Error fetching codes:", event);
          reject(new Error("Failed to fetch codes"));
        };
      });
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to get all codes: ${error}`);
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
          reject(new Error("Failed to check chart existence"));
        };
      });
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to check chart existence: ${error}`);
    }
  }
}
