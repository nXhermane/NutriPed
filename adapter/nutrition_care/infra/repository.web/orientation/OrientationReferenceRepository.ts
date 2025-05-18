import { OrientationReference, OrientationReferenceRepository } from "@core/nutrition_care";
import { SystemCode } from "@shared";
import { EntityBaseRepositoryWeb } from "../../../../shared";
import { OrientationReferencePersistenceDto } from "../../dtos";

export class OrientationReferenceRepositoryWebImpl 
    extends EntityBaseRepositoryWeb<OrientationReference, OrientationReferencePersistenceDto> 
    implements OrientationReferenceRepository {
    
    protected storeName = "orientation_refs";

    async getByCode(code: SystemCode): Promise<OrientationReference> {
        try {
            const store = await this.getObjectStore();
            return new Promise((resolve, reject) => {
                const request = store.index("code").get(code.unpack());

                request.onsuccess = (event) => {
                    const result = (event.target as IDBRequest).result;
                    if (!result) {
                        reject(new Error(`OrientationReference with code ${code.unpack()} not found`));
                        return;
                    }
                    resolve(this.mapper.toDomain(result as OrientationReferencePersistenceDto));
                };

                request.onerror = (event) => {
                    console.error("Error fetching orientation reference by code:", event);
                    reject(new Error("Failed to fetch orientation reference"));
                };
            });
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to get orientation reference by code: ${error}`);
        }
    }
     async exist(code: SystemCode): Promise<boolean> {
      try {
         const store = await this.getObjectStore();
         return new Promise((resolve, reject) => {
            const request = store.index("code").count(code.unpack());

            request.onsuccess = (event) => {
               const count = (event.target as IDBRequest).result;
               resolve(count > 0);
            };

            request.onerror = (event) => {
               console.error("Error checking existence:", event);
               reject(new Error("Failed to check orientation ref existence"));
            };
         });
      } catch (error) {
         console.error(error);
         throw new Error(`Failed to check orientation ref existence: ${error}`);
      }
   }

}