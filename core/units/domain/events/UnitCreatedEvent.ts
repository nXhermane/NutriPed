import { AggregateID, DomainEvent, DomainEventMessage } from "@shared";

export interface UnitCreatedData {
   id: AggregateID;
   code: string;
   name: string;
   baseUnit: string;
   factor: number;
}

@DomainEventMessage("New Unit Created", true)
export class UnitCreatedEvent extends DomainEvent<UnitCreatedData> {}
