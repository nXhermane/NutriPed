import { AggregateID, DomainEvent, DomainEventMessage } from "@/core/shared";

export interface MedicalRecordDeletedEventData {
  medicalRecordId: AggregateID;
}

@DomainEventMessage("Medical Record Deleted Event", true)
export class MedicalRecordDeletedEvent extends DomainEvent<MedicalRecordDeletedEventData> {}
