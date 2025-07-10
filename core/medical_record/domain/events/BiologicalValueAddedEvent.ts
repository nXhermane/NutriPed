import { AggregateID, DomainEvent, DomainEventMessage } from "@shared";

export interface BiologicalValueAddedEventData {
  patientId: AggregateID;
  data: {
    code: string;
    value: number;
    unit: string;
  };
}

@DomainEventMessage("The biological value added to medical record.", true)
export class BiologicalValueAddedEvent extends DomainEvent<BiologicalValueAddedEventData> {}
