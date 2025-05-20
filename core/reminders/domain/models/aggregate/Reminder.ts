import { DomainDate, Time } from "@shared";

export interface IReminder {
  title: string;
  date: DomainDate
  time?: Time
  description: string 
}
