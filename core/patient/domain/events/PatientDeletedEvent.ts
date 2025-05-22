import { AggregateID, DomainEvent, DomainEventMessage } from "@shared";

export interface PatientDeletedData {
  id: AggregateID;
}
@DomainEventMessage("Patient Deleted Event", true)
export class PatientDeletedEvent extends DomainEvent<PatientDeletedData> {}
