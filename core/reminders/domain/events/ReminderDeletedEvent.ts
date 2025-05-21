import { AggregateID, DomainEvent, DomainEventMessage } from "@shared";

export interface ReminderDeletedEventData {
  id: AggregateID;
}

@DomainEventMessage("Reminder Deleted Event.", true)
export class ReminderDeletedEvent extends DomainEvent<ReminderDeletedEventData> {}
