import { Unit, UnitRepository, UnitType } from "@core/units";
import { SystemCode, AggregateID, InfraMapToDomainError } from "@shared";
import {
  EntityBaseRepositoryExpo,
  RepositoryException,
  RepositoryNotFoundError,
} from "../../../shared";
import { UnitPersistenceDto } from "../dtos";
import { units } from "./db";
import { eq } from "drizzle-orm";

export class UnitRepositoryExpoImpl
  extends EntityBaseRepositoryExpo<Unit, UnitPersistenceDto, typeof units>
  implements UnitRepository
{
  async getByCode(code: SystemCode): Promise<Unit> {
    try {
      const entityPersistenceType = await this.db
        .select()
        .from(this.table)
        .where(eq(this.table.code, code.unpack()))
        .get();
      if (!entityPersistenceType)
        throw new RepositoryNotFoundError(
          `Unit with code [${code.unpack()}] not found.`
        );
      const entity = this.mapper.toDomain(
        entityPersistenceType as UnitPersistenceDto
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
          `[${code.unpack()}]: UnitRepository getting internal error`,
          e as Error
        );
      }
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
