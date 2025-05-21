import { AggregateID, DomainEvent, DomainEventMessage, IDateTime } from "@shared";
import { IReminderAction, ReminderRepeat } from "../models";

export interface ReminderCreatedEventData {
  id: AggregateID;
  title: string;
  message: string;
  scheduledTime: IDateTime;
  createdAt?: IDateTime;
  repeat: ReminderRepeat;
  isActive: boolean;
  actions: IReminderAction[];
}

@DomainEventMessage("Reminder Created Event",true)
export class ReminderCreatedEvent extends DomainEvent<ReminderCreatedEventData> {}
