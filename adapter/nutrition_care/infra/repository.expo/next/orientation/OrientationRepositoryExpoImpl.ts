import { EntityBaseRepository } from "@/adapter/shared/repository.expo";
import { OrientationReference } from "@/core/nutrition_care/domain/modules/next/orientation/models";
import { IOrientationReferenceRepository } from "@/core/nutrition_care/domain/modules/next/orientation/ports";
import { AggregateID, IEventBus, InfrastructureMapper } from "@/core/shared";
import { OrientationPersistenceDto } from "../../../dtos/next/orientation";
import { next_orientation_references } from "../../db/nutrition_care.schema";
import { SQLiteDatabase } from "expo-sqlite";

export class OrientationRepositoryExpoImpl
  extends EntityBaseRepository<
    OrientationReference,
    OrientationPersistenceDto,
    typeof next_orientation_references
  >
  implements IOrientationReferenceRepository
{
  constructor(
    db: SQLiteDatabase,
    mapper: InfrastructureMapper<
      OrientationReference,
      OrientationPersistenceDto
    >,
    eventBus: IEventBus
  ) {
    super(db, mapper, next_orientation_references, eventBus);
  }

  async getOne(id: AggregateID): Promise<OrientationReference | undefined> {
    try {
      const entity = await this.getById(id);
      return entity;
    } catch (error: any) {
      if (error.message.includes("not found")) { // Make error check more robust
        return undefined;
      }
      throw error;
    }
  }

  async create(entity: OrientationReference): Promise<void> {
    return this.save(entity);
  }

  async update(entity: OrientationReference): Promise<void> {
    return this.save(entity);
  }
}
