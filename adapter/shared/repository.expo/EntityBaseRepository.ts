import {
  AggregateID,
  AggregateRoot,
  Entity,
  EntityPropsBaseType,
  EventHandlerExecutionFailed,
  IEventBus,
  InfraMapToDomainError,
  InfrastructureMapper,
  Repository,
} from "@shared";
import { SQLiteDatabase } from "expo-sqlite";
import {
  SQLiteColumn,
  SQLiteTable,
  SQLiteTransaction,
} from "drizzle-orm/sqlite-core";
import { drizzle, ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm";
import {
  RepositoryException,
  RepositoryNotFoundError,
} from "./expo.repository.errors";

export interface BaseTableFields {
  id: SQLiteColumn;
  createdAt: SQLiteColumn;
  updatedAt: SQLiteColumn;
}
export abstract class EntityBaseRepositoryExpo<
  DomainEntity extends Entity<EntityPropsBaseType>,
  PersistenceModel extends object,
  TableSchema extends SQLiteTable & BaseTableFields,
> implements Repository<DomainEntity>
{
  protected readonly db: ExpoSQLiteDatabase;
  constructor(
    expo: SQLiteDatabase,
    protected readonly mapper: InfrastructureMapper<
      DomainEntity,
      PersistenceModel
    >,
    protected table: TableSchema,
    protected readonly eventBus: IEventBus | null = null
  ) {
    this.db = drizzle(expo);
  }

  async save(
    entity: DomainEntity,
    trx?: SQLiteTransaction<any, any, any, any>
  ): Promise<void> {
    try {
      const persistenceType = this.mapper.toPersistence(entity);
      const exist = await this._exist(entity.id);
      const queryRunner = trx || this.db;
      if (!exist) {
        await queryRunner.insert(this.table).values(persistenceType);
      } else {
        await queryRunner
          .update(this.table)
          .set(persistenceType)
          .where(eq(this.table.id, entity.id.toString()));
      }
      if (entity instanceof AggregateRoot && this.eventBus) {
        const domainEvents = entity.getDomainEvents();
        if (domainEvents.length === 0) return;
        await Promise.all(
          domainEvents.map(event =>
            this.eventBus?.publishAndDispatchImmediate(event)
          )
        );
      }
    } catch (e: unknown) {
      if (e instanceof EventHandlerExecutionFailed) throw e;
      throw new RepositoryException(
        `[${entity.constructor.name}]: Repository saving internal Error`,
        e as Error,
        {}
      );
    }
  }
  async getById(id: AggregateID): Promise<DomainEntity> {
    try {
      const entityPersistenceType = await this.db
        .select()
        .from(this.table)
        .where(eq(this.table.id, id as string))
        .get();
      if (!entityPersistenceType)
        throw new RepositoryNotFoundError(`Entity with id [${id}] not found.`);
      const entity = this.mapper.toDomain(
        entityPersistenceType as PersistenceModel
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
          `[${id}]: Repository getting internal error`,
          e as Error
        );
      }
    }
  }
  async getAll(): Promise<DomainEntity[]> {
    try {
      const entityPersistenceTypes = (await this.db
        .select()
        .from(this.table)
        .all()) as PersistenceModel[];
      return entityPersistenceTypes.map(this.mapper.toDomain);
    } catch (e: unknown) {
      throw new RepositoryException(
        `Repository getting all internal error`,
        e as Error
      );
    }
  }
  async delete(
    id: AggregateID,
    trx?: SQLiteTransaction<any, any, any, any>
  ): Promise<void> {
    try {
      const queryRunner = trx || this.db;
      await queryRunner
        .delete(this.table)
        .where(eq(this.table.id, id as string));
    } catch (e: unknown) {
      throw new RepositoryException(
        `[${id}]: Repository deleting internal error`,
        e as Error,
        { id }
      );
    }
  }
  async remove(
    entity: DomainEntity,
    trx?: SQLiteTransaction<any, any, any, any>
  ) {
    try {
      await this.delete(entity.id, trx);
      await this.dispatchEventIfItAggregateRoot(entity);
    } catch (e: unknown) {
      if (
        e instanceof EventHandlerExecutionFailed ||
        e instanceof RepositoryException
      )
        throw e;
      throw new RepositoryException(
        `[${entity.constructor.name}]: Repository Removing internal Error`,
        e as Error
      );
    }
  }
  protected async _exist(entityId: AggregateID): Promise<boolean> {
    const entity = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.id, entityId as string))
      .get();
    return !!entity;
  }
  protected async dispatchEventIfItAggregateRoot(entity: DomainEntity) {
    if (entity instanceof AggregateRoot && this.eventBus) {
      const domainEvents = entity.getDomainEvents();
      if (domainEvents.length === 0) return;
      await Promise.all(
        domainEvents.map(event =>
          this.eventBus?.publishAndDispatchImmediate(event)
        )
      );
    }
  }
}
