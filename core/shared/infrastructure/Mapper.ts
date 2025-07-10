import { Entity, EntityPropsBaseType } from "../domain";

export interface InfrastructureMapper<
  DomainEntity extends Entity<EntityPropsBaseType>,
  PersistenceType extends object,
> {
  toPersistence(entity: DomainEntity): PersistenceType;
  toDomain(record: PersistenceType): DomainEntity;
}
