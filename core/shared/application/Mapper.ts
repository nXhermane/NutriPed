import { Entity, EntityPropsBaseType } from "../domain";

export interface ApplicationMapper<
  DomainEntity extends Entity<EntityPropsBaseType>,
  Dto extends object
> {
  toResponse(entity: DomainEntity): Dto;
}
