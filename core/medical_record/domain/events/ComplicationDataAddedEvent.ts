import { AggregateID, DomainEvent, DomainEventMessage } from "@shared";

export interface ComplicationDataAddedEventData {
   patientId: AggregateID;
   data: {
      code: string;
      isPresent: boolean;
   };
}

@DomainEventMessage("The complication data added to medical record.", true)
export class ComplicationDataAddedEvent extends DomainEvent<ComplicationDataAddedEventData> {}
