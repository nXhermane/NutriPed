import {
  DomainEvent,
  EventData,
  EventHandler,
  EventType,
  IDomainEvent,
} from "domain-eventrix";
export {
  DomainEvent,
  DomainEventMessage,
  bindEventHandler,
  EventHandler,
} from "domain-eventrix";
export interface IEventBus {
  publish<Data extends EventData, T extends DomainEvent<Data>>(event: T): void;
  publishAndDispatchImmediate<
    Data extends EventData,
    T extends DomainEvent<Data>,
  >(
    event: T
  ): Promise<void>;
  subscribe<DataType extends EventData, T extends IDomainEvent<DataType>>(
    handler: EventHandler<DataType, T>
  ): void;
  unsubscribe<DataType extends EventData, T extends IDomainEvent<DataType>>(
    handler: EventHandler<DataType, T>
  ): void;

  dispatch<T extends EventData = any>(eventType: EventType<T>): void;
}
