import {
  NutritionalAssessmentResult,
  NutritionalAssessmentResultRepository,
  NutritionalDiagnostic,
  NutritionalDiagnosticRepository,
  PatientDiagnosticData,
  PatientDiagnosticDataRepository,
} from "@core/diagnostics";
import {
  EntityBaseRepositoryExpo,
  RepositoryException,
  RepositoryNotFoundError,
} from "../../../../shared";
import {
  NutritionalAssessmentResultPersistenceDto,
  NutritionalDiagnosticPersistenceDto,
  PatientDiagnosticDataPersistenceDto,
} from "../..";
import { nutritional_diagnostics } from "../db";
import {
  AggregateID,
  EventHandlerExecutionFailed,
  IEventBus,
  InfraMapToDomainError,
  InfrastructureMapper,
} from "@shared";
import { SQLiteTransaction } from "drizzle-orm/sqlite-core";
import { SQLiteDatabase } from "expo-sqlite";
import { eq, or } from "drizzle-orm";

export interface NutritionalDiagnosticRepoParams {
  result: NutritionalAssessmentResultRepository;
  diagnosticData: PatientDiagnosticDataRepository;
}
export interface NutritionalDiagnosticMapperParams {
  result: InfrastructureMapper<
    NutritionalAssessmentResult,
    NutritionalAssessmentResultPersistenceDto
  >;
  diagnosticData: InfrastructureMapper<
    PatientDiagnosticData,
    PatientDiagnosticDataPersistenceDto
  >;
}
export class NutritionalDiagnosticRepositoryExpoImpl
  extends EntityBaseRepositoryExpo<
    NutritionalDiagnostic,
    NutritionalDiagnosticPersistenceDto,
    typeof nutritional_diagnostics
  >
  implements NutritionalDiagnosticRepository
{
  constructor(
    expo: SQLiteDatabase,
    mapper: InfrastructureMapper<
      NutritionalDiagnostic,
      NutritionalDiagnosticPersistenceDto
    >,
    table: typeof nutritional_diagnostics,
    eventBus: IEventBus,
    private repos: NutritionalDiagnosticRepoParams,
    private mappers: NutritionalDiagnosticMapperParams
  ) {
    super(expo, mapper, table, eventBus);
  }
  override async save(entity: NutritionalDiagnostic): Promise<void> {
    try {
      const persistenceType = this.mapper.toPersistence(entity);
      const exist = await this._exist(entity.id);
      this.db.transaction(async tx => {
        if (exist) {
          tx.insert(this.table).values({
            ...persistenceType,
            patientData: persistenceType.patientData.id,
            result: persistenceType.result?.id,
          });
        } else {
          tx.update(this.table)
            .set({
              ...persistenceType,
              patientData: persistenceType.patientData.id,
              result: persistenceType.result?.id,
            })
            .where(eq(this.table.id, persistenceType.id));
        }
        await this.repos.diagnosticData.save(entity.getProps().patientData);
        if (entity.getProps().result)
          await this.repos.result.save(
            entity.getProps().result as NutritionalAssessmentResult
          );
        await this.dispatchEventIfItAggregateRoot(entity);
      });
    } catch (e: unknown) {
      if (e instanceof EventHandlerExecutionFailed) throw e;
      throw new RepositoryException(
        `[${entity.constructor.name}]: Repository saving internal Error`,
        e as Error,
        {}
      );
    }
  }
  override async getAll(): Promise<NutritionalDiagnostic[]> {
    throw new Error("Not Usable");
  }
  override async getById(id: AggregateID): Promise<NutritionalDiagnostic> {
    throw new Error("Not Usable");
  }
  async getByIdOrPatientId(id: AggregateID): Promise<NutritionalDiagnostic> {
    try {
      const entityRecord = await this.db
        .select()
        .from(this.table)
        .where(
          or(
            eq(this.table.id, id as string),
            eq(this.table.patientId, id as string)
          )
        )
        .get();
      if (!entityRecord)
        throw new RepositoryNotFoundError(`Entity with id [${id}] not found.`);
      const entityPersistenceType = await this.toDomain(
        entityRecord as NutritionalDiagnosticPersistenceDto & {
          result: string | undefined;
          patientData: string;
        }
      );
      return this.mapper.toDomain(entityPersistenceType);
    } catch (e: unknown) {
      if (
        e instanceof InfraMapToDomainError ||
        e instanceof RepositoryNotFoundError
      ) {
        throw e;
      } else {
        throw new RepositoryException(
          `[${id}]: Repository getting internal error`,
          e as Error
        );
      }
    }
  }

  private async toDomain(
    record: NutritionalDiagnosticPersistenceDto & {
      result: string | undefined;
      patientData: string;
    }
  ): Promise<NutritionalDiagnosticPersistenceDto> {
    const result = record.result
      ? await this.repos.result.getById(record.result)
      : undefined;
    const patientData = await this.repos.diagnosticData.getById(
      record.patientData
    );
    return {
      ...record,
      result: result ? this.mappers.result.toPersistence(result) : undefined,
      patientData: this.mappers.diagnosticData.toPersistence(patientData),
    };
  }
}
