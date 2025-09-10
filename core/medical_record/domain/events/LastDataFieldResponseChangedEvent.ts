import { AggregateID, DomainEvent, DomainEventMessage } from "@shared";
import { DataFieldResponseValue } from "../models";

export interface LastDataFieldResponseChangedEventData {
  patientId: AggregateID;
  data: {
    code: string;
    data: DataFieldResponseValue;
  };
}

@DomainEventMessage("The data field response added to medical record.", true)
export class LastDataFieldResponseChangedEvent extends DomainEvent<LastDataFieldResponseChangedEventData> {}
