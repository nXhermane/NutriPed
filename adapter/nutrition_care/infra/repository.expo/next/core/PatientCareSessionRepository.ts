import { PatientCareSession, PatientCareSessionRepository } from "@/core/nutrition_care/domain/next/core";
import { EntityBaseRepositoryExpo } from "../../../../../shared";
import { PatientCareSessionAggregatePersistenceDto, PatientCareSessionAggregatePersistenceRecordDto } from "../../../dtos/next/core";
import { patient_care_session_aggregates } from "../../db";
import { AggregateID, IEventBus, InfrastructureMapper } from "@/core/shared";
import { eq, or } from "drizzle-orm";
import { RepositoryException, RepositoryNotFoundError } from "../../../../../shared/repository.expo/expo.repository.errors";
import { SQLiteDatabase } from "expo-sqlite";
import { NextCore } from "@/core/nutrition_care";

export class PatientCareSessionRepositoryExpoImpl
  extends EntityBaseRepositoryExpo<
    PatientCareSession,
    PatientCareSessionAggregatePersistenceDto,
    typeof patient_care_session_aggregates,
    PatientCareSessionAggregatePersistenceRecordDto
  >
  implements PatientCareSessionRepository
{
 

  constructor(
    expo: SQLiteDatabase,
    mapper: InfrastructureMapper<NextCore.PatientCareSession, PatientCareSessionAggregatePersistenceDto,PatientCareSessionAggregatePersistenceRecordDto>,
    eventBus: IEventBus,
    private carePhaseRepository: NextCore.CarePhaseRepository,
    private dailyCareRecordRepository:NextCore.DailyCareRecordRepository,
    private messageRepository:NextCore.CareMessageRepository,

  ) {
    super(
      expo,mapper,
      patient_care_session_aggregates,
      eventBus
    );
  }

  async getByIdOrPatientId(patientIdOrId: AggregateID): Promise<PatientCareSession> {
    try {
      const sessionPersistence = await this.db
        .select()
        .from(this.table)
        .where(
          or(
            eq(this.table.id, patientIdOrId as string),
            eq(this.table.patientId, patientIdOrId as string)
          )
        )
        .get();

      if (!sessionPersistence) {
        throw new RepositoryNotFoundError(
          `PatientCareSession with id or patient id [${patientIdOrId}] not found.`
        );
      }

      // Reconstruire les entités liées à partir des IDs stockés
      const recordDto = await this.buildCompleteRecord(sessionPersistence as PatientCareSessionAggregatePersistenceDto);
      
      const entity = this.mapper.toDomain(recordDto);
      return entity;
    } catch (e: unknown) {
      if (e instanceof RepositoryNotFoundError) {
        throw e;
      } else {
        throw new RepositoryException(
          `[${patientIdOrId}]: Repository getting internal error`,
          e as Error
        );
      }
    }
  }

  private async buildCompleteRecord(
    sessionPersistence: PatientCareSessionAggregatePersistenceDto
  ): Promise<PatientCareSessionAggregatePersistenceRecordDto> {
    // Récupérer les entités liées par leurs IDs
    const currentPhase = sessionPersistence.currentPhase 
      ? await this.carePhaseRepository.getById(sessionPersistence.currentPhase)
      : null;

    const phaseHistory = await Promise.all(
      sessionPersistence.phaseHistory.map(id => this.carePhaseRepository.getById(id))
    );

    const dailyRecords = await Promise.all(
      sessionPersistence.dailyRecords.map(id => this.dailyCareRecordRepository.getById(id))
    );

    const currentDailyRecord = sessionPersistence.currentDailyRecord
      ? await this.dailyCareRecordRepository.getById(sessionPersistence.currentDailyRecord)
      : null;

    const inbox = await Promise.all(
      sessionPersistence.inbox.map(id => this.messageRepository.getById(id))
    );

    return {
      ...sessionPersistence,
      currentPhase,
      currentDailyRecord,
      phaseHistory,
      dailyRecords,
      inbox,
      responses: sessionPersistence.responses // UserResponse déjà complets
    };
  }

  // Override save pour sauvegarder les entités liées avec transaction
  async save(entity: PatientCareSession, trx?: any): Promise<void> {
    // Si aucune transaction n'est fournie, créer une nouvelle transaction
    if (!trx) {
      return this.db.transaction(async (transaction) => {
        await this.saveWithTransaction(entity, transaction);
      });
    } else {
      // Utiliser la transaction existante
      await this.saveWithTransaction(entity, trx);
    }
  }

  private async saveWithTransaction(entity: PatientCareSession, trx: any): Promise<void> {
    // Sauvegarder d'abord les entités liées avec la même transaction
    const currentPhase = entity.getCurrentPhase();
    if (currentPhase) {
      await this.carePhaseRepository.save(currentPhase, trx);
    }

    const phaseHistory = entity.getPhaseHistory();
    for (const phase of phaseHistory) {
      await this.carePhaseRepository.save(phase, trx);
    }

    const dailyRecords = entity.getDailyRecords();
    for (const record of dailyRecords) {
      await this.dailyCareRecordRepository.save(record, trx);
    }

    const currentDailyRecord = entity.getCurrentDailyRecord();
    if (currentDailyRecord) {
      await this.dailyCareRecordRepository.save(currentDailyRecord, trx);
    }

    const inbox = entity.getInbox();
    for (const message of inbox) {
      await this.messageRepository.save(message, trx);
    }

    // Ensuite sauvegarder l'agrégat principal avec la transaction
    await super.save(entity, trx);
  }

  async exist(id: AggregateID): Promise<boolean> {
    return this._exist(id);
  }
}