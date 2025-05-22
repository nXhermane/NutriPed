import { MedicalRecord, MedicalRecordRepository } from "@core/medical_record";
import { AggregateID, AggregateRoot } from "@shared";
import { EntityBaseRepositoryWeb } from "../../../shared";
import { MedicalRecordPersistenceDto } from "../dtos";

export class MedicalRecordRepositoryWebImpl
  extends EntityBaseRepositoryWeb<MedicalRecord, MedicalRecordPersistenceDto>
  implements MedicalRecordRepository
{
  protected storeName = "medical_records";

  async getByPatientIdOrID(patientIdOrId: AggregateID): Promise<MedicalRecord> {
    try {
      const store = await this.getObjectStore();
      return new Promise((resolve, reject) => {
        // Essayer d'abord avec l'ID patient
        const patientIdRequest = store
          .index("patientId")
          .get(patientIdOrId.toString());

        patientIdRequest.onsuccess = async event => {
          let result = (event.target as IDBRequest).result;

          if (!result) {
            // Si pas trouvé par patientId, essayer avec l'ID du dossier
            const idRequest = store.index("id").get(patientIdOrId.toString());

            idRequest.onsuccess = event => {
              result = (event.target as IDBRequest).result;
              if (!result) {
                reject(new Error("Medical Record not found"));
                return;
              }
              resolve(
                this.mapper.toDomain(result as MedicalRecordPersistenceDto)
              );
            };

            idRequest.onerror = event => {
              console.error("Error fetching by ID:", event);
              reject(new Error("Failed to fetch medical record"));
            };
          } else {
            resolve(
              this.mapper.toDomain(result as MedicalRecordPersistenceDto)
            );
          }
        };

        patientIdRequest.onerror = event => {
          console.error("Error fetching by patient ID:", event);
          reject(new Error("Failed to fetch medical record"));
        };
      });
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to get medical record: ${error}`);
    }
  }

  async remove(medicalRecord: MedicalRecord): Promise<void> {
    try {
      if (!medicalRecord.id) {
        throw new Error("Cannot remove medical record without id");
      }

      await this.delete(medicalRecord.id as AggregateID);
      if (medicalRecord instanceof AggregateRoot) {
        const domainEvents = medicalRecord.getDomainEvents();
        if (this.eventBus) {
          const eventPublishingPromises = domainEvents.map(
            this.eventBus.publishAndDispatchImmediate
          );
          await Promise.all(eventPublishingPromises);
        }
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to remove medical record: ${error}`);
    }
  }
}
