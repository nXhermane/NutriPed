
import { EntityBaseRepository } from "../../../common";

import { SystemCode } from "@shared";
import { MilkPersistenceDto } from "../../mappers";
import { Milk, MilkRepository } from "@core/nutrition_care";

export class MilkRepositoryImpl 
    extends EntityBaseRepository<Milk, MilkPersistenceDto> 
    implements MilkRepository {
    
    protected storeName = "milks";

    async getByCode(code: SystemCode): Promise<Milk> {
        try {
            const store = await this.getObjectStore();
            return new Promise((resolve, reject) => {
                const request = store.index("code").get(code.unpack());

                request.onsuccess = (event) => {
                    const result = (event.target as IDBRequest).result;
                    if (!result) {
                        reject(new Error(`Milk with code ${code.unpack()} not found`));
                        return;
                    }
                    resolve(this.mapper.toDomain(result as MilkPersistenceDto));
                };

                request.onerror = (event) => {
                    console.error("Error fetching milk by code:", event);
                    reject(new Error("Failed to fetch milk"));
                };
            });
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to get milk by code: ${error}`);
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
               reject(new Error("Failed to check milk existence"));
            };
         });
      } catch (error) {
         console.error(error);
         throw new Error(`Failed to check milk existence: ${error}`);
      }
   }

}