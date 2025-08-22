import { AggregateID, DomainEvent, DomainEventMessage } from "@shared";

export interface LastClinicalSignDataChangedEventData {
  patientId: AggregateID;
  data: {
    code: string;
    data: {
      [key: string]: any;
    };
  };
}

@DomainEventMessage("The clinical sign data Added to medical record.", true)
export class LastClinicalSignDataChangedEvent extends DomainEvent<LastClinicalSignDataChangedEventData> {}
