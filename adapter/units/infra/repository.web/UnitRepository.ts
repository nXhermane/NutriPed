import { UnitType } from "@core/constants";
import { Unit, UnitRepository } from "@core/units";
import { SystemCode, AggregateID, AggregateRoot } from "@shared";
import { EntityBaseRepository } from "../../../shared";
import { UnitPersistenceDto } from "../dtos";


export class UnitRepositoryWebImpl extends EntityBaseRepository<Unit, UnitPersistenceDto> implements UnitRepository {
   protected storeName = "units";

   async getByCode(code: SystemCode): Promise<Unit> {
      try {
         const store = await this.getObjectStore();
         return new Promise((resolve, reject) => {
            const request = store.index("code").get(code.unpack());

            request.onsuccess = (event) => {
               const result = (event.target as IDBRequest).result as UnitPersistenceDto;
               if (!result) {
                  reject(new Error(`Unit with code ${code.unpack()} not found`));
                  return;
               }
               resolve(this.mapper.toDomain(result));
            };

            request.onerror = (event) => {
               console.error("Error fetching by code:", event);
               reject(new Error("Failed to fetch unit by code"));
            };
         });
      } catch (error) {
         console.error(error);
         throw new Error(`Failed to get unit by code: ${error}`);
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
               reject(new Error("Failed to check unit existence"));
            };
         });
      } catch (error) {
         console.error(error);
         throw new Error(`Failed to check unit existence: ${error}`);
      }
   }

   async getAll(type?: UnitType): Promise<Unit[]> {
      try {
         const store = await this.getObjectStore();
         return new Promise((resolve, reject) => {
            const request = type ? store.index("type").getAll(type) : store.getAll();

            request.onsuccess = (event) => {
               const results = (event.target as IDBRequest).result;
               if (!results) {
                  resolve([]);
                  return;
               }
               const entities = results.map((item: UnitPersistenceDto) => this.mapper.toDomain(item));
               resolve(entities);
            };

            request.onerror = (event) => {
               console.error("Error fetching units:", event);
               reject(new Error("Failed to fetch units"));
            };
         });
      } catch (error) {
         console.error(error);
         throw new Error(`Failed to get units: ${error}`);
      }
   }

   async remove(unit: Unit): Promise<void> {
      try {
         if (!unit.id) {
            throw new Error("Cannot remove unit without id");
         }
         await this.delete(unit.id as AggregateID);
         if (unit instanceof AggregateRoot) {
            const domainEvents = unit.getDomainEvents();
            if (this.eventBus) {
               const eventPublishingPromises = domainEvents.map(this.eventBus.publishAndDispatchImmediate);
               await Promise.all(eventPublishingPromises);
            }
         }
      } catch (error) {
         console.error(error);
         throw new Error(`Failed to remove unit: ${error}`);
      }
   }
}
