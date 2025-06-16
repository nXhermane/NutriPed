import {
  DailyCareJournal,
  DailyCareJournalRepository,
  PatientCareSession,
  PatientCareSessionRepository,
  PatientCurrentState,
  PatientCurrentStateRepository,
} from "@core/nutrition_care";
import {
  EntityBaseRepositoryExpo,
  RepositoryException,
  RepositoryNotFoundError,
} from "../../../../shared";
import {
  DailyJournalPersistenceDto,
  PatientCareSessionPersistenceDto,
  PatientCurrentStatePersistenceDto,
} from "../../dtos";
import { patient_care_sessions } from "../db";
import {
  AggregateID,
  EventHandlerExecutionFailed,
  IEventBus,
  InfraMapToDomainError,
  InfrastructureMapper,
} from "@shared";
import { SQLiteTransaction } from "drizzle-orm/sqlite-core";
import { eq, or } from "drizzle-orm";
import { SQLiteDatabase } from "expo-sqlite";

export interface PatientCareSessionRepoParams {
  currentStateRepo: PatientCurrentStateRepository;
  dailyJournalRepo: DailyCareJournalRepository;
}
export interface PatientCareSessionMapperParams {
  currentStateMapper: InfrastructureMapper<
    PatientCurrentState,
    PatientCurrentStatePersistenceDto
  >;
  dailyJournalRepo: InfrastructureMapper<
    DailyCareJournal,
    DailyJournalPersistenceDto
  >;
}
export class PatientCareSessionRepositoryExpoImpl
  extends EntityBaseRepositoryExpo<
    PatientCareSession,
    PatientCareSessionPersistenceDto,
    typeof patient_care_sessions
  >
  implements PatientCareSessionRepository
{
  constructor(
    expo: SQLiteDatabase,
    mapper: InfrastructureMapper<
      PatientCareSession,
      PatientCareSessionPersistenceDto
    >,
    table: typeof patient_care_sessions,
    eventBus: IEventBus,
    private repos: PatientCareSessionRepoParams,
    private mappers: PatientCareSessionMapperParams
  ) {
    super(expo, mapper, table, eventBus);
  }
  override async save(
    entity: PatientCareSession,
    trx?: SQLiteTransaction<any, any, any, any>
  ): Promise<void> {
    try {
      const persistenceType = this.mapper.toPersistence(entity);
      const exist = await this._exist(entity.id);
      await this.db.transaction(async tx => {
        if (!exist) {
          await tx
            .insert(this.table)
            .values(this.toPersistence(persistenceType));
        } else {
          await tx
            .update(this.table)
            .set(this.toPersistence(persistenceType))
            .where(eq(this.table.id, persistenceType.id));
        }
        await this.repos.currentStateRepo.save(entity.getProps().currentState);
        await Promise.all(
          [
            ...entity.getProps().dailyJournals,
            ...(entity.getCurrentJournal()
              ? [entity.getCurrentJournal() as DailyCareJournal]
              : []),
          ].map(dailyJournal => this.repos.dailyJournalRepo.save(dailyJournal))
        );
        await this.dispatchEventIfItAggregateRoot(entity);
      });
    } catch (e: unknown) {
      console.error(e);
      if (e instanceof EventHandlerExecutionFailed) throw e;
      throw new RepositoryException(
        `[${entity.constructor.name}]: Repository saving internal Error`,
        e as Error,
        {}
      );
    }
  }
  override async getById(id: AggregateID): Promise<PatientCareSession> {
    throw new Error("Not Usable");
  }

  override getAll(): Promise<PatientCareSession[]> {
    throw new Error("Not Usable");
  }
  async getByIdOrPatientId(
    sessionIdOrPatientId: AggregateID
  ): Promise<PatientCareSession> {
    try {
      const entityRecord = await this.db
        .select()
        .from(this.table)
        .where(
          or(
            eq(this.table.id, sessionIdOrPatientId as string),
            eq(this.table.patientId, sessionIdOrPatientId as string)
          )
        )
        .get();
      if (!entityRecord)
        throw new RepositoryNotFoundError(
          `Entity with id [${sessionIdOrPatientId}] not found.`
        );
      const entityPersistenceType = await this.toDomain(
        entityRecord as PatientCareSessionPersistenceDto & {
          currentDailyJournal?: string;
          dailyJournals: { id: string; date: string }[];
          currentState: string;
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
          `[${sessionIdOrPatientId}]: Repository getting internal error`,
          e as Error
        );
      }
    }
  }

  private toPersistence(persistenceType: PatientCareSessionPersistenceDto) {
    return {
      ...persistenceType,
      currentDailyJournal: persistenceType.currentDailyJournal?.id,
      dailyJournals: persistenceType.dailyJournals.map(entity => ({
        id: entity.id,
        date: entity.date,
      })),
      currentState: persistenceType.currentState.id,
    };
  }
  private async toDomain(
    record: PatientCareSessionPersistenceDto & {
      currentDailyJournal?: string;
      dailyJournals: { id: string; date: string }[];
      currentState: string;
    }
  ): Promise<PatientCareSessionPersistenceDto> {
    const currentState = await this.repos.currentStateRepo.getById(
      record.currentState
    );
    const dailyJournals = await Promise.all(
      record.dailyJournals.map(value =>
        this.repos.dailyJournalRepo.getById(value.id)
      )
    );
    const currentDailyJournal = record.currentDailyJournal
      ? await this.repos.dailyJournalRepo.getById(record.currentDailyJournal)
      : undefined;
    return {
      ...record,
      currentState: this.mappers.currentStateMapper.toPersistence(currentState),
      dailyJournals: dailyJournals.map(dailyJournal =>
        this.mappers.dailyJournalRepo.toPersistence(dailyJournal)
      ),
      currentDailyJournal: currentDailyJournal
        ? this.mappers.dailyJournalRepo.toPersistence(
            currentDailyJournal as DailyCareJournal
          )
        : undefined,
    };
  }
}
