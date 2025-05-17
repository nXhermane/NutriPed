import { Patient, PatientRepository } from "@core/patient";
import { AggregateID, AggregateRoot } from "@shared";
import { EntityBaseRepository } from "../../../shared";
import { PatientPersistenceDto } from "../dtos";


export class PatientRepositoryWebImpl extends EntityBaseRepository<Patient, PatientPersistenceDto> implements PatientRepository {
   protected storeName = "patients";



   async exist(id: AggregateID): Promise<boolean> {
      try {
         const store = await this.getObjectStore();
         return new Promise((resolve, reject) => {
            const request = store.index("id").count(id.toString());

            request.onsuccess = (event) => {
               const count = (event.target as IDBRequest).result;
               resolve(count > 0);
            };

            request.onerror = (event) => {
               console.error("Error checking patient existence:", event);
               reject(new Error("Failed to check patient existence"));
            };
         });
      } catch (error) {
         console.error(error);
         throw new Error(`Failed to check patient existence: ${error}`);
      }
   }

   async remove(patient: Patient): Promise<void> {
      try {
         if (!patient.id) {
            throw new Error("Cannot remove patient without id");
         }

         await this.delete(patient.id as AggregateID);
         if (patient instanceof AggregateRoot) {
            const domainEvents = patient.getDomainEvents();
            if (this.eventBus) {
               const eventPublishingPromises = domainEvents.map(this.eventBus.publishAndDispatchImmediate);
               await Promise.all(eventPublishingPromises);
            }
         }
      } catch (error) {
         console.error(error);
         throw new Error(`Failed to remove patient: ${error}`);
      }
   }
}
