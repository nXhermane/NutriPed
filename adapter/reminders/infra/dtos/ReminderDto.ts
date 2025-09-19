import {
  IReminderAction,
  ReminderTriggerInputData,
  ReminderTriggerType,
} from "@/core/reminders";
import { IDateTime } from "@shared";

export interface ReminderPersistenceDto {
  id: string;
  title: string;
  message: string;
  trigger: {
    type: ReminderTriggerType;
    data: ReminderTriggerInputData[keyof ReminderTriggerInputData];
  };
  reminderCreatedAt: IDateTime;
  isActive: boolean;
  actions: IReminderAction[];
  createdAt: string;
  updatedAt: string;
}
