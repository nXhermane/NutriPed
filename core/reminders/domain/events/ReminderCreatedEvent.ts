import {
  AggregateID,
  DomainEvent,
  DomainEventMessage,
  IDateTime,
} from "@shared";
import { IReminderAction, SerializedReminderTrigger } from "../models";

export interface ReminderCreatedEventData {
  id: AggregateID;
  title: string;
  message: string;
  trigger: SerializedReminderTrigger;
  createdAt?: IDateTime;
  isActive: boolean;
  actions: IReminderAction[];
}

@DomainEventMessage("Reminder Created Event", true)
export class ReminderCreatedEvent extends DomainEvent<ReminderCreatedEventData> {}
