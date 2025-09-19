import { AggregateID, DomainEvent, DomainEventMessage } from "@shared";

export interface MedicalRecordCreatedEventData {
  patientId: AggregateID;
  medicalRecordId: AggregateID;
}
@DomainEventMessage("New Medical Record Created Event", true)
export class MedicalRecordCreatedEvent extends DomainEvent<MedicalRecordCreatedEventData> {}
