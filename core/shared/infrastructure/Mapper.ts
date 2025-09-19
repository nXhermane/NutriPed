import { Entity, EntityPropsBaseType } from "../domain";

export interface InfrastructureMapper<
  DomainEntity extends Entity<EntityPropsBaseType>,
  PersistenceType extends object,
  PersistenceRecordType extends object = PersistenceType,
> {
  toPersistence(entity: DomainEntity): PersistenceType;
  toDomain(record: PersistenceType | PersistenceRecordType): DomainEntity;
}
