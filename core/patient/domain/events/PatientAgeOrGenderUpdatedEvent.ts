import { AggregateID, DomainEvent, DomainEventMessage, Sex } from "@shared";

export interface PatientAgeOrGenderUpdatedData {
  id: AggregateID;
  birthday: string;
  sex: `${Sex}`;
}
@DomainEventMessage("Patient Birthday or Gender updated", true)
export class PatientAgeOrGenderUpdatedEvent extends DomainEvent<PatientAgeOrGenderUpdatedData> {}
