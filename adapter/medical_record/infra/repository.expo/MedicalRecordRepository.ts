import { MedicalRecord, MedicalRecordRepository } from "@core/medical_record";
import {
  EntityBaseRepositoryExpo,
  RepositoryException,
  RepositoryNotFoundError,
} from "../../../shared";
import { MedicalRecordPersistenceDto } from "../dtos";
import { medical_records } from "./db";
import { AggregateID, InfraMapToDomainError } from "@shared";
import { eq, or } from "drizzle-orm";

export class MedicalRecordRepositoryExpoImpl
  extends EntityBaseRepositoryExpo<
    MedicalRecord,
    MedicalRecordPersistenceDto,
    typeof medical_records
  >
  implements MedicalRecordRepository
{
  async getByPatientIdOrID(patientIdOrId: AggregateID): Promise<MedicalRecord> {
    try {
      const entityPersistenceType = await this.db
        .select()
        .from(this.table)
        .where(
          or(
            eq(this.table.id, patientIdOrId as string),
            eq(this.table.patientId, patientIdOrId as string)
          )
        )
        .get();
      if (!entityPersistenceType)
        throw new RepositoryNotFoundError(
          `MedicalRecord with id or patient id  [${patientIdOrId}] not found.`
        );
      const entity = this.mapper.toDomain(
        entityPersistenceType as MedicalRecordPersistenceDto
      );
      return entity;
    } catch (e: unknown) {
      if (
        e instanceof InfraMapToDomainError ||
        e instanceof RepositoryNotFoundError
      ) {
        throw e;
      } else {
        throw new RepositoryException(
          `[${patientIdOrId}]: Repository getting internal error`,
          e as Error
        );
      }
    }
  }
}
