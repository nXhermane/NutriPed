import {
  Entity,
  EntityPropsBaseType,
  InfraMapToDomainError,
  SystemCode,
} from "@shared";
import { SQLiteColumn, SQLiteTable } from "drizzle-orm/sqlite-core";
import {
  BaseTableFields,
  EntityBaseRepositoryExpo,
} from "./EntityBaseRepository";
import { AnthropometricMeasure } from "@core/diagnostics";
import { eq } from "drizzle-orm";
import { AnthropometricMeasurePersistenceDto } from "../../diagnostics/infra";
import {
  RepositoryNotFoundError,
  RepositoryException,
} from "./expo.repository.errors";

export abstract class EntityBaseRepositoryExpoWithCodeColumn<
  DomainEntity extends Entity<EntityPropsBaseType>,
  PersistenceModel extends object,
  TableSchema extends SQLiteTable & BaseTableFields & { code: SQLiteColumn }
> extends EntityBaseRepositoryExpo<
  DomainEntity,
  PersistenceModel,
  TableSchema
> {
  async getByCode(code: SystemCode): Promise<DomainEntity> {
    try {
      const entityPersistenceType = await this.db
        .select()
        .from(this.table)
        .where(eq(this.table.code, code.unpack()))
        .get();
      if (!entityPersistenceType)
        throw new RepositoryNotFoundError(
          `Entity with code [${code.unpack()}] not found.`
        );
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
          `[${code.unpack()}]: Repository getting internal error`,
          e as Error
        );
      }
    }
  }
  async getAllCode(): Promise<SystemCode[]> {
    try {
      const entityPersistenceTypes = await this.db
        .select({ code: this.table.code })
        .from(this.table)
        .all();
      return entityPersistenceTypes.map(
        (code) => new SystemCode({ _value: code.code as string })
      );
    } catch (e: unknown) {
      throw new RepositoryException(
        `Repository getting all code internal error`,
        e as Error
      );
    }
  }
  async exist(code: SystemCode): Promise<boolean> {
    const entity = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.id, code.unpack()))
      .get();
    return !!entity;
  }
}
