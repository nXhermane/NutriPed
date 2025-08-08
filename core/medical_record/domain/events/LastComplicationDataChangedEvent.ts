import { AggregateID, DomainEvent, DomainEventMessage } from "@shared";

export interface LastComplicationDataChangedEventData {
  patientId: AggregateID;
  data: {
    code: string;
    isPresent: boolean;
  };
}

@DomainEventMessage("The complication data added to medical record.", true)
export class LastComplicationDataChangedEvent extends DomainEvent<LastComplicationDataChangedEventData> {}
