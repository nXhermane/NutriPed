import {
  AggregateID,
  DomainEvent,
  DomainEventMessage,
  IDateTime,
} from "@shared";
import { ReminderRepeat, IReminderAction } from "../models";

export interface ReminderUpdatedEventData {
  id: AggregateID;
  title: string;
  message: string;
  scheduledTime: IDateTime;
  createdAt?: IDateTime;
  repeat: ReminderRepeat;
  isActive: boolean;
  actions: IReminderAction[];
}

@DomainEventMessage("Reminder Updated Event", true)
export class ReminderUpdatedEvent extends DomainEvent<ReminderUpdatedEventData> {}
