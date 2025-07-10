import {
  BiochemicalReference,
  BiochemicalReferenceRepository,
} from "@core/diagnostics";
import { SystemCode } from "@shared";
import { EntityBaseRepositoryWeb } from "../../../../shared";
import { BiochemicalReferencePersistenceDto } from "../../dtos";

export class BiochemicalReferenceRepositoryWebImpl
  extends EntityBaseRepositoryWeb<
    BiochemicalReference,
    BiochemicalReferencePersistenceDto
  >
  implements BiochemicalReferenceRepository
{
  protected storeName = "biochemical_references";

  async getByCode(code: SystemCode): Promise<BiochemicalReference> {
    try {
      const store = await this.getObjectStore();
      return new Promise((resolve, reject) => {
        const request = store.index("code").get(code.unpack());

        request.onsuccess = event => {
          const result = (event.target as IDBRequest).result;
          if (!result) {
            reject(
              new Error(
                `BiochemicalReference with code ${code.unpack()} not found`
              )
            );
            return;
          }
          resolve(
            this.mapper.toDomain(result as BiochemicalReferencePersistenceDto)
          );
        };

        request.onerror = event => {
          console.error("Error fetching biochemical reference by code:", event);
          reject(new Error("Failed to fetch biochemical reference"));
        };
      });
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to get biochemical reference by code: ${error}`);
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
          reject(new Error("Failed to check biochemical ref existence"));
        };
      });
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to check biochemical ref existence: ${error}`);
    }
  }
}
