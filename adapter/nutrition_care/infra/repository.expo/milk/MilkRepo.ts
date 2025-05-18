import { Milk, MilkRepository, MilkType } from "@core/nutrition_care";
import {
  EntityBaseRepositoryExpo,
  EntityBaseRepositoryExpoWithCodeColumn,
  RepositoryException,
  RepositoryNotFoundError,
} from "../../../../shared";
import { MilkPersistenceDto } from "../../dtos";
import { milks } from "../db";
import { InfraMapToDomainError, SystemCode } from "@shared";
import { eq } from "drizzle-orm";

export class MilkRepositoryExpoImpl
  extends EntityBaseRepositoryExpo<Milk, MilkPersistenceDto, typeof milks>
  implements MilkRepository
{
  async getByType(type: MilkType): Promise<Milk> {
    try {
      const entityPersistenceType = await this.db
        .select()
        .from(this.table)
        .where(eq(this.table.type, type))
        .get();
      if (!entityPersistenceType)
        throw new RepositoryNotFoundError(
          `Milk with type [${type}] not found.`
        );
      const entity = this.mapper.toDomain(
        entityPersistenceType as MilkPersistenceDto
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
          `[${type}]: Repository getting internal error`,
          e as Error
        );
      }
    }
  }
}
