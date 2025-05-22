import { AggregateID, DomainEvent, DomainEventMessage } from "@shared";

export interface ClinicalSignDataAddedEventData {
  patientId: AggregateID;
  data: {
    code: string;
    data: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    };
  };
}

@DomainEventMessage("The clinical sign data Added to medical record.", true)
export class ClinicalSignDataAddedEvent extends DomainEvent<ClinicalSignDataAddedEventData> {}
