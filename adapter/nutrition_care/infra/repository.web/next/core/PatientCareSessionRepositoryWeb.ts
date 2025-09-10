import { EntityBaseRepositoryWeb } from "@/adapter/shared/repository.web";
import {
  PatientCareSession,
  PatientCareSessionRepository,
} from "@/core/nutrition_care/domain/next/core";
import {
  PatientCareSessionAggregatePersistenceDto,
  PatientCareSessionAggregatePersistenceRecordDto,
} from "../../../dtos/next/core";
import { AggregateID } from "@/core/shared";

export class PatientCareSessionRepositoryWeb
  extends EntityBaseRepositoryWeb<
    PatientCareSession,
    PatientCareSessionAggregatePersistenceDto,
    PatientCareSessionAggregatePersistenceRecordDto
  >
  implements PatientCareSessionRepository
{
  protected storeName = "patient_care_session_aggregates";

  getById(id: AggregateID): Promise<PatientCareSession> {
    throw new Error("Method not implemented.");
  }
  save(entity: PatientCareSession, trx?: any): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(id: AggregateID, trx?: any): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async getByIdOrPatientId(
    patientIdOrId: AggregateID
  ): Promise<PatientCareSession> {
    try {
      const store = await this.getObjectStore();
      return new Promise((resolve, reject) => {
        // Try to find by ID first
        const idRequest = store.index("id").get(patientIdOrId.toString());

        idRequest.onsuccess = event => {
          const result = (event.target as IDBRequest).result;
          if (result) {
            resolve(
              this.mapper.toDomain(
                result as PatientCareSessionAggregatePersistenceDto
              )
            );
            return;
          }

          // If not found by ID, try by patientId
          const patientIdRequest = store
            .index("patientId")
            .get(patientIdOrId.toString());

          patientIdRequest.onsuccess = patientEvent => {
            const patientResult = (patientEvent.target as IDBRequest).result;
            if (!patientResult) {
              reject(new Error("PatientCareSession not found"));
              return;
            }
            resolve(
              this.mapper.toDomain(
                patientResult as PatientCareSessionAggregatePersistenceDto
              )
            );
          };

          patientIdRequest.onerror = patientEvent => {
            console.error("Error fetching by patientId:", patientEvent);
            reject(new Error("Failed to fetch PatientCareSession"));
          };
        };

        idRequest.onerror = event => {
          console.error("Error fetching by ID:", event);
          reject(new Error("Failed to fetch PatientCareSession"));
        };
      });
    } catch (error) {
      console.error(error);
      throw new Error(error as string);
    }
  }

  async exist(id: AggregateID): Promise<boolean> {
    try {
      const store = await this.getObjectStore();
      return new Promise((resolve, reject) => {
        const request = store.index("id").get(id.toString());

        request.onsuccess = event => {
          const result = (event.target as IDBRequest).result;
          resolve(!!result);
        };

        request.onerror = event => {
          console.error("Error checking existence:", event);
          reject(new Error("Failed to check entity existence"));
        };
      });
    } catch (error) {
      console.error(error);
      throw new Error(error as string);
    }
  }
}
