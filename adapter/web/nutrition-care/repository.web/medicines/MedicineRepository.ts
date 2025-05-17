import { EntityBaseRepository } from "../../../common";

import { SystemCode } from "@shared";
import { MedicinePersistenceDto } from "../../mappers";
import { Medicine, MedicineRepository } from "@core/nutrition_care";

export class MedicineRepositoryImpl extends EntityBaseRepository<Medicine, MedicinePersistenceDto> implements MedicineRepository {
   protected storeName = "medicines";

   async getByCode(code: SystemCode): Promise<Medicine> {
      try {
         const store = await this.getObjectStore();
         return new Promise((resolve, reject) => {
            const request = store.index("code").get(code.unpack());

            request.onsuccess = (event) => {
               const result = (event.target as IDBRequest).result;
               if (!result) {
                  reject(new Error(`Medicine with code ${code.unpack()} not found`));
                  return;
               }
               resolve(this.mapper.toDomain(result as MedicinePersistenceDto));
            };

            request.onerror = (event) => {
               console.error("Error fetching medicine by code:", event);
               reject(new Error("Failed to fetch medicine"));
            };
         });
      } catch (error) {
         console.error(error);
         throw new Error(`Failed to get medicine by code: ${error}`);
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
               reject(new Error("Failed to check medicine existence"));
            };
         });
      } catch (error) {
         console.error(error);
         throw new Error(`Failed to check medicine existence: ${error}`);
      }
   }
}
