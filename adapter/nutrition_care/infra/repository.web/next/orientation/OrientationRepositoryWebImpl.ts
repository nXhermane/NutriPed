import { EntityBaseRepositoryWeb, IndexedDBConnection } from "@/adapter/shared/repository.web";
import { OrientationReference } from "@/core/nutrition_care/domain/modules/next/orientation/models";
import { IOrientationReferenceRepository } from "@/core/nutrition_care/domain/modules/next/orientation/ports";
import { AggregateID, IEventBus, InfrastructureMapper } from "@/core/shared";
import { OrientationPersistenceDto } from "../../../dtos/next/orientation";

export class OrientationRepositoryWeb
  extends EntityBaseRepositoryWeb<OrientationReference, OrientationPersistenceDto>
  implements IOrientationReferenceRepository
{
  protected storeName = "next_orientation_references";

  constructor(
    protected readonly dbConnection: IndexedDBConnection,
    protected readonly mapper: InfrastructureMapper<
      OrientationReference,
      OrientationPersistenceDto
    >,
    protected readonly eventBus: IEventBus | null = null
  ) {
    super(dbConnection, mapper, eventBus);
  }

  async getOne(id: AggregateID): Promise<OrientationReference | undefined> {
    try {
      // getById from the base class throws an error if the entity is not found.
      // We catch this specific error to return undefined, as per the interface contract.
      const entity = await this.getById(id);
      return entity;
    } catch (error: any) {
      // "Entity Not found" is the error message thrown by the base class.
      if (error.message === "Entity Not found") {
        return undefined;
      }
      // Re-throw any other unexpected errors.
      throw error;
    }
  }

  async create(entity: OrientationReference): Promise<void> {
    // The 'save' method in the base class handles both creation and updates (put).
    return this.save(entity);
  }

  async update(entity: OrientationReference): Promise<void> {
    return this.save(entity);
  }
}
