import { AnthropometricMeasure, AnthropometricMeasureRepository } from "@core/diagnostics";
import { EntityBaseRepository } from "../../../common";
import { AnthropometricMeasurePersistenceDto } from "../../persistenceDto/anthropometry";
import { SystemCode } from "@shared";

export class AnthropometricMeasureRepositoryImpl 
    extends EntityBaseRepository<AnthropometricMeasure, AnthropometricMeasurePersistenceDto> 
    implements AnthropometricMeasureRepository {
    
    protected storeName = "anthropometric_measures";

    async getByCode(code: SystemCode): Promise<AnthropometricMeasure> {
        try {
            const store = await this.getObjectStore();
            return new Promise((resolve, reject) => {
                const request = store.index("code").get(code.unpack());

                request.onsuccess = (event) => {
                    const result = (event.target as IDBRequest).result;
                    if (!result) {
                        reject(new Error(`AnthropometricMeasure with code ${code.unpack()} not found`));
                        return;
                    }
                    resolve(this.mapper.toDomain(result as AnthropometricMeasurePersistenceDto));
                };

                request.onerror = (event) => {
                    console.error("Error fetching anthropometric measure by code:", event);
                    reject(new Error("Failed to fetch anthropometric measure"));
                };
            });
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to get anthropometric measure by code: ${error}`);
        }
    }

    async getAllCode(): Promise<SystemCode[]> {
        try {
            const store = await this.getObjectStore();
            return new Promise((resolve, reject) => {
                const request = store.index("code").getAllKeys();

                request.onsuccess = (event) => {
                    const results = (event.target as IDBRequest).result;
                    if (!results) {
                        resolve([]);
                        return;
                    }
                    const codes = results.map((code: string) => 
                        SystemCode.create(code).val
                    );
                    resolve(codes);
                };

                request.onerror = (event) => {
                    console.error("Error fetching codes:", event);
                    reject(new Error("Failed to fetch codes"));
                };
            });
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to get all codes: ${error}`);
        }
    } async exist(code: SystemCode): Promise<boolean> {
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
               reject(new Error("Failed to check measure existence"));
            };
         });
      } catch (error) {
         console.error(error);
         throw new Error(`Failed to check measure existence: ${error}`);
      }
   }


}