import { AggregateID, Entity, EntityPropsBaseType } from "../domain";

export interface Repository<DomainEntity extends Entity<EntityPropsBaseType>> {
  getById(id: AggregateID): Promise<DomainEntity>;
  save(entity: DomainEntity, trx?: any): Promise<void>;
  delete(id: AggregateID, trx?: any): Promise<void>;
}
