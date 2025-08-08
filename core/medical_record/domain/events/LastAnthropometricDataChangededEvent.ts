import { AggregateID, DomainEvent, DomainEventMessage } from "@shared";
import { AnthropometricDataContext } from "../models";

export interface LastAnthropometricDataChangedEventData {
  patientId: AggregateID;
  data: {
    code: string;
    value: number;
    unit: string;
    context: `${AnthropometricDataContext}`;
  };
}

@DomainEventMessage("Anthropometric measure added.", true)
export class LastAnthropometricDataChangedEvent extends DomainEvent<LastAnthropometricDataChangedEventData> {}
