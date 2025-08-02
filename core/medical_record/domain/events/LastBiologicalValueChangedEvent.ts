import { AggregateID, DomainEvent, DomainEventMessage } from "@shared";

export interface LastBiologicalValueChangedEventData {
  patientId: AggregateID;
  data: {
    code: string;
    value: number;
    unit: string;
  };
}

@DomainEventMessage("The biological value added to medical record.", true)
export class LastBiologicalValueChangedEvent extends DomainEvent<LastBiologicalValueChangedEventData> {}
