import { AggregateID, DomainEvent, DomainEventMessage } from "@shared";

export interface UnitDeletedData {
  id: AggregateID;
  code: string;
}

@DomainEventMessage("Unit Deleted From System", true)
export class UnitDeletedEvent extends DomainEvent<UnitDeletedData> {}
