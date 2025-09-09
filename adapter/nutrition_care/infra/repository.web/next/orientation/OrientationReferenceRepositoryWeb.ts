import { EntityBaseRepositoryWeb } from "@/adapter/shared/repository.web";
import { OrientationReference } from "@/core/nutrition_care/domain/modules/next/orientation/models";
import { OrientationReferenceRepository } from "@/core/nutrition_care/domain/modules/next/orientation/ports/secondary/repository";
import { OrientationReferencePersistenceDto } from "../../../dtos/next/orientation";
import { SystemCode } from "@/core/shared";

export class OrientationReferenceRepositoryWeb
  extends EntityBaseRepositoryWeb<
    OrientationReference,
    OrientationReferencePersistenceDto
  >
  implements OrientationReferenceRepository
{
  protected storeName = "next_orientation_references";

  async getByCode(code: SystemCode): Promise<OrientationReference> {
    try {
      const store = await this.getObjectStore();
      return new Promise((resolve, reject) => {
        const request = store.index("code").get(code.unpack());

        request.onsuccess = event => {
          const result = (event.target as IDBRequest).result;
          if (!result) {
            reject(new Error("OrientationReference not found"));
            return;
          }
          resolve(
            this.mapper.toDomain(result as OrientationReferencePersistenceDto)
          );
        };

        request.onerror = event => {
          console.error("Error fetching by code:", event);
          reject(new Error("Failed to fetch OrientationReference"));
        };
      });
    } catch (error) {
      console.error(error);
      throw new Error(error as string);
    }
  }

  async exist(code: SystemCode): Promise<boolean> {
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
          reject(new Error("Failed to check OrientationReference existence"));
        };
      });
    } catch (error) {
      console.error(error);
      throw new Error(error as string);
    }
  }
}
