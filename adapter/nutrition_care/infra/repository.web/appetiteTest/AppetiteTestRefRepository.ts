import { AppetiteTestRef, AppetiteTestRefRepository } from "@core/nutrition_care";
import { SystemCode } from "@shared";
import { EntityBaseRepositoryWeb } from "../../../../shared";
import { AppetiteTestReferencePersistenceDto } from "../../dtos";

export class AppetiteTestRefRepositoryWebImpl 
    extends EntityBaseRepositoryWeb<AppetiteTestRef, AppetiteTestReferencePersistenceDto>
    implements AppetiteTestRefRepository {
    
    protected storeName = "appetite_test_refs";

    async getByCode(code: SystemCode): Promise<AppetiteTestRef> {
        try {
            const store = await this.getObjectStore();
            return new Promise((resolve, reject) => {
                const request = store.index("code").get(code.unpack());

                request.onsuccess = (event) => {
                    const result = (event.target as IDBRequest).result;
                    if (!result) {
                        reject(new Error(`AppetiteTestRef with code ${code.unpack()} not found`));
                        return;
                    }
                    resolve(this.mapper.toDomain(result as AppetiteTestReferencePersistenceDto));
                };

                request.onerror = (event) => {
                    console.error("Error fetching AppetiteTestRef by code:", event);
                    reject(new Error("Failed to fetch AppetiteTestRef"));
                };
            });
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to get AppetiteTestRef by code: ${error}`);
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
               reject(new Error("Failed to check appetite test existence"));
            };
         });
      } catch (error) {
         console.error(error);
         throw new Error(`Failed to check appetite test existence: ${error}`);
      }
   }

}