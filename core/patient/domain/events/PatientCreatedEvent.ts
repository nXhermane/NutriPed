import { AggregateID, DomainEvent, DomainEventMessage, Sex } from "@shared";

export interface PatientCreatedData {
  id: AggregateID;
  sex: `${Sex}`;
  birthday: string;
}
@DomainEventMessage("New Patient Created Event", true)
export class PatientCreatedEvent extends DomainEvent<PatientCreatedData> {}
