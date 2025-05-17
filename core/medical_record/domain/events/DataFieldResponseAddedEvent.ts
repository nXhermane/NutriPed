import { AggregateID, DomainEvent, DomainEventMessage } from "@shared";
import { DataFieldResponseType } from "../models";

export interface DataFieldResponseAddedEventData {
   patientId: AggregateID;
   data: {
      code: string;
      unit?: string;
      value: number | string | boolean;
      type: DataFieldResponseType;
   };
}

@DomainEventMessage("The data field response added to medical record.", true)
export class DataFieldResponseAddedEvent extends DomainEvent<DataFieldResponseAddedEventData> {}
