import {
  AggregateID,
  DomainEvent,
  DomainEventMessage,
  IDateTime,
} from "@shared";
import { IReminderAction, SerializedReminderTrigger } from "../models";

export interface ReminderUpdatedEventData {
  id: AggregateID;
  title: string;
  message: string;
  trigger: SerializedReminderTrigger
  createdAt?: IDateTime;
  isActive: boolean;
  actions: IReminderAction[];
}

@DomainEventMessage("Reminder Updated Event", true)
export class ReminderUpdatedEvent extends DomainEvent<ReminderUpdatedEventData> { }
