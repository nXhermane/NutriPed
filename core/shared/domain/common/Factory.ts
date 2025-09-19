import { Result } from "../../core";
import { Entity, EntityPropsBaseType } from "./Entity";

export interface Factory<
  Props extends EntityPropsBaseType,
  T extends Entity<EntityPropsBaseType>,
> {
  create(props: Props): Result<T> | Promise<Result<T>>;
}
