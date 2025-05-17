import { EntityUniqueID } from "./EntityUniqueId";
import { Guard } from "../../core";
import { DomainDate } from "../shared";
import { ValueType } from "../../utils/types";
export type AggregateID = string | number;

export interface BaseEntityProps {
  id: AggregateID;
  createdAt: string;
  updatedAt: string;
}
export interface CreateEntityProps<T> {
  id: AggregateID;
  props: T;
  createdAt?: string;
  updatedAt?: string;
}
export type EntityPropsKeyValueType = ValueType | undefined;
export type EntityPropsBaseType = Record<string, EntityPropsKeyValueType>;
// Entity Class Base
export abstract class Entity<EntityProps extends EntityPropsBaseType> {
  private readonly _id: EntityUniqueID;
  private readonly _createdAt: DomainDate;
  private _updatedAt: DomainDate;
  protected _isValid: boolean = false;
  protected _isDeleted: boolean = false;
  public readonly props: EntityProps;
  constructor({
    createdAt,
    updatedAt,
    id,
    props,
  }: CreateEntityProps<EntityProps>) {
    this._id = new EntityUniqueID(id);
    this.validateProps(props);
    this._createdAt = DomainDate.create(createdAt).val;
    this._updatedAt = DomainDate.create(updatedAt).val;
    this.props = this.createProxy(props);
    this?.validate();
  }
  private handler(): ProxyHandler<EntityProps> {
    const handler: ProxyHandler<EntityProps> = {
      set: (
        target: EntityProps,
        key: string | symbol,
        newValue: EntityPropsBaseType
      ) => {
        if (typeof key === "string" && !(key in target)) {
          throw new Error(`Property "${key}" does not exist on entity props.`);
        }
        const isSuccess = Reflect.set(target, key, newValue);
        if (isSuccess) this._updatedAt = new DomainDate();
        return isSuccess;
      },
    };
    return handler;
  }
  private createProxy(props: EntityProps): EntityProps {
    return new Proxy(props, this.handler());
  }
  get id(): AggregateID {
    return this._id.toValue();
  }
  get createdAt(): string {
    return this._createdAt.toString();
  }
  get updatedAt(): string {
    return this._updatedAt.toString();
  }

  /**
   * Returns entity properties.
   * @return {*}  {Props & EntityProps}
   * @memberof Entity
   */
  public getProps(): EntityProps & BaseEntityProps {
    const propsCopy = {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      ...this.props,
    };
    return Object.freeze(propsCopy);
  }

  // Verify if is an Entity Object
  static isEntity = (
    object: unknown
  ): object is Entity<EntityPropsBaseType> => {
    return object instanceof Entity;
  };
  /**
   *  Checks if two entities are the same Entity by comparing ID field.
   * @param obj Entity
   */
  public equals(obj?: Entity<EntityProps>): boolean {
    if (obj == null || obj == undefined) {
      return false;
    }

    if (this === obj) {
      return true;
    }

    if (!Entity.isEntity(obj)) {
      return false;
    }

    return this._id.equals(obj._id);
  }
  /**
   * There are certain rules that always have to be true (invariants)
   * for each entity. Validate method is called every time before
   * saving an entity to the database to make sure those rules are respected.
   */
  public abstract validate(): void;

  private validateProps(props: EntityProps): void {
    const MAX_PROPS = 50;
    if (Guard.isEmpty(props).succeeded) {
      throw new Error("Entity props should not be empty");
    }
    if (typeof props !== "object") {
      throw new Error("Entity props should be an object");
    }
    if (Object.keys(props).length > MAX_PROPS) {
      throw new Error(
        `Entity props should not have more than ${MAX_PROPS} properties`
      );
    }
  }

  public isValid(): boolean {
    try {
      this?.validate();
      return this._isValid;
    } catch {
      return false;
    }
  }
  get isDeleted(): boolean {
    return this._isDeleted;
  }
  /**
   * @method created Called after when a Entity is created
   * @description In this method you are able to notify a system by domainEvent
   */
  public created(): void {}
  /**
   * @method delete Called Before paste entity to repo delete method
   */
  public delete(): void {
    this._isDeleted = true;
  }
}
