import { DiagnosticRule, DiagnosticRuleRepository } from "@core/diagnostics";
import { SystemCode } from "@shared";
import { EntityBaseRepository } from "../../../../shared";
import { DiagnosticRulePersistenceDto } from "../../dtos";


export class DiagnosticRuleRepositoryWebImpl 
    extends EntityBaseRepository<DiagnosticRule, DiagnosticRulePersistenceDto> 
    implements DiagnosticRuleRepository {
    
    protected storeName = "diagnostic_rules";

    async getByCode(code: SystemCode): Promise<DiagnosticRule> {
        try {
            const store = await this.getObjectStore();
            return new Promise((resolve, reject) => {
                const request = store.index("code").get(code.unpack());

                request.onsuccess = (event) => {
                    const result = (event.target as IDBRequest).result;
                    if (!result) {
                        reject(new Error(`DiagnosticRule with code ${code.unpack()} not found`));
                        return;
                    }
                    resolve(this.mapper.toDomain(result as DiagnosticRulePersistenceDto));
                };

                request.onerror = (event) => {
                    console.error("Error fetching diagnostic rule by code:", event);
                    reject(new Error("Failed to fetch diagnostic rule"));
                };
            });
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to get diagnostic rule by code: ${error}`);
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
               reject(new Error("Failed to check diagnostic rule existence"));
            };
         });
      } catch (error) {
         console.error(error);
         throw new Error(`Failed to check diagnostic rule existence: ${error}`);
      }
   }

}