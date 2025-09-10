import { Entity, EntityPropsBaseType, ValueObject } from "../domain";

export interface ApplicationMapper<
  DomainEntity extends Entity<EntityPropsBaseType> | ValueObject<any>,
  Dto extends object,
> {
  toResponse(entity: DomainEntity): Dto;
}
