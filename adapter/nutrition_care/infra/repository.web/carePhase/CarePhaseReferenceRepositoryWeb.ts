import { SystemCode } from "@shared";
import { EntityBaseRepositoryWeb } from "@/adapter/shared";
import { CarePhaseReferencePersistenceDto } from "../../dtos/carePhase/CarePhaseReferencePersistenceDto";
import { CarePhaseReference, CarePhaseReferenceRepository } from "@/core/nutrition_care";

export class CarePhaseReferenceRepositoryWeb
  extends EntityBaseRepositoryWeb<CarePhaseReference, CarePhaseReferencePersistenceDto>
  implements CarePhaseReferenceRepository
{
  protected storeName = "care_phase_references";

  async getByCode(code: SystemCode): Promise<CarePhaseReference> {
    try {
      const store = await this.getObjectStore();
      return new Promise((resolve, reject) => {
        const request = store.index("code").get(code.unpack());

        request.onsuccess = event => {
          const result = (event.target as IDBRequest).result;
          if (!result) {
            reject(new Error(`CarePhaseReference with code ${code.unpack()} not found`));
            return;
          }
          resolve(this.mapper.toDomain(result as CarePhaseReferencePersistenceDto));
        };

        request.onerror = event => {
          console.error("Error fetching care phase reference by code:", event);
          reject(new Error("Failed to fetch care phase reference"));
        };
      });
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to get care phase reference by code: ${error}`);
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
          reject(new Error("Failed to check care phase reference existence"));
        };
      });
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to check care phase reference existence: ${error}`);
    }
  }
}
