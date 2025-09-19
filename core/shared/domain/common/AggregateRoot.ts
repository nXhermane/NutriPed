import { Entity, AggregateID, EntityPropsBaseType } from "./Entity";
import { DomainEvent } from "./../events";

export abstract class AggregateRoot<
  EntityProps extends EntityPropsBaseType,
> extends Entity<EntityProps> {
  getID(): AggregateID {
    return this.id;
  }
  getDomainEvents(): DomainEvent<object>[] {
    return this._domainEvents;
  }
  clearDomainEvent(): void {
    this._domainEvents = [];
  }
  protected addDomainEvent<T extends object>(
    domainEvent: DomainEvent<T>
  ): void {
    // Add the domain event to this aggregate's list of domain events
    this._domainEvents.push(domainEvent);
    // Log the domain event
    this.logDomainEventAdded(domainEvent);
  }

  private logDomainEventAdded(domainEvent: DomainEvent<object>): void {
    const thisClass = Reflect.getPrototypeOf(this);
    console.info(
      `[Domain Event Created]:`,
      thisClass?.constructor.name,
      "==>",
      domainEvent.getName()
    );
  }
}
