import { AggregateID, DomainEvent, DomainEventMessage } from "@shared";
import { AnthropometricDataContext } from "../models/valueObjects/AnthropometricData";

export interface AnthropometricDataAddedEventData {
   patientId: AggregateID;
   data: {
      code: string;
      value: number;
      unit: string;
      context: `${AnthropometricDataContext}`;
   };
}

@DomainEventMessage("Anthropometric measure added.", true)
export class AnthropometricDataAddedEvent extends DomainEvent<AnthropometricDataAddedEventData> {}
