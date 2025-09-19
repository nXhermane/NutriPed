import { AggregateID, IDateTime } from "@shared";
import {
  IReminderAction,
  ReminderTriggerInputData,
  ReminderTriggerType,
} from "../../domain";

export interface ReminderDto {
  id: AggregateID;
  title: string;
  message: string;
  trigger: {
    type: ReminderTriggerType;
    data: ReminderTriggerInputData[keyof ReminderTriggerInputData];
  };
  isActive: boolean;
  actions: IReminderAction[];
  createdAt: IDateTime;
}
