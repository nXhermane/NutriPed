import { AggregateID, Entity, EntityPropsBaseType } from "../domain";

export interface Repository<DomainEntity extends Entity<EntityPropsBaseType>> {
   getById(id: AggregateID): Promise<DomainEntity>;
   save(entity: DomainEntity): Promise<void>;
   delete(id: AggregateID): Promise<void>;
}
