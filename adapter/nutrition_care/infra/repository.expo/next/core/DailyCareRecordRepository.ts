import {
  DailyCareRecord,
  DailyCareRecordRepository,
  DailyCareAction,
  DailyMonitoringTask,
} from "@/core/nutrition_care/domain/next/core";
import { EntityBaseRepositoryExpo } from "../../../../../shared";
import {
  DailyCareRecordPersistenceDto,
  DailyCareRecordPersistenceRecordDto,
} from "../../../dtos/next/core";
import { daily_care_records } from "../../db";
import {
  AggregateID,
  IEventBus,
  InfrastructureMapper,
  Repository,
} from "@/core/shared";
import { eq } from "drizzle-orm";
import {
  RepositoryException,
  RepositoryNotFoundError,
} from "../../../../../shared/repository.expo/expo.repository.errors";
import { SQLiteDatabase } from "expo-sqlite";

export class DailyCareRecordRepositoryExpoImpl
  extends EntityBaseRepositoryExpo<
    DailyCareRecord,
    DailyCareRecordPersistenceDto,
    typeof daily_care_records,
    DailyCareRecordPersistenceRecordDto
  >
  implements DailyCareRecordRepository
{
  constructor(
    expo: SQLiteDatabase,
    mapper: InfrastructureMapper<
      DailyCareRecord,
      DailyCareRecordPersistenceDto,
      DailyCareRecordPersistenceRecordDto
    >,
    schema: typeof daily_care_records,
    private dailyCareActionRepository: Repository<DailyCareAction>,
    private dailyMonitoringTaskRepository: Repository<DailyMonitoringTask>,
    eventBus: IEventBus | null = null
  ) {
    super(expo, mapper, schema, eventBus);
  }

  async exist(id: AggregateID): Promise<boolean> {
    return this._exist(id);
  }

  // Override getById pour gérer la reconstruction complexe
  async getById(id: AggregateID): Promise<DailyCareRecord> {
    try {
      const record = await this.db
        .select()
        .from(this.table)
        .where(eq(this.table.id, id as string))
        .get();

      if (!record) {
        throw new RepositoryNotFoundError(
          `DailyCareRecord with id [${id}] not found.`
        );
      }

      // Reconstruire les entités liées à partir des IDs stockés
      const recordDto = await this.buildCompleteRecord(
        record as DailyCareRecordPersistenceDto
      );

      return this.mapper.toDomain(recordDto);
    } catch (e: unknown) {
      if (e instanceof RepositoryNotFoundError) {
        throw e;
      } else {
        throw new RepositoryException(
          `[${id}]: Repository getting internal error`,
          e as Error
        );
      }
    }
  }

  private async buildCompleteRecord(
    recordPersistence: DailyCareRecordPersistenceDto
  ): Promise<DailyCareRecordPersistenceRecordDto> {
    // Récupérer les entités liées par leurs IDs
    const treatmentActions = await Promise.all(
      recordPersistence.treatmentActions.map(id =>
        this.dailyCareActionRepository.getById(id)
      )
    );

    const monitoringTasks = await Promise.all(
      recordPersistence.monitoringTasks.map(id =>
        this.dailyMonitoringTaskRepository.getById(id)
      )
    );

    return {
      ...recordPersistence,
      treatmentActions,
      monitoringTasks,
    };
  }

  // Override save pour sauvegarder les entités liées
  async save(entity: DailyCareRecord, trx?: any): Promise<void> {
    // Sauvegarder d'abord les entités liées
    const treatmentActions = entity.getProps().treatmentActions;
    for (const action of treatmentActions) {
      await this.dailyCareActionRepository.save(action, trx);
    }

    const monitoringTasks = entity.getProps().monitoringTasks;
    for (const task of monitoringTasks) {
      await this.dailyMonitoringTaskRepository.save(task, trx);
    }

    // Ensuite sauvegarder l'entité principale
    await super.save(entity, trx);
  }
}
