import {
  IReminderAction,
  ReminderTriggerInputData,
  ReminderTriggerType,
} from "@/core/reminders";
import { IDateTime } from "@shared";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const reminders = sqliteTable("reminders", {
  id: text("reminder_id").primaryKey(),
  title: text("reminder_title").notNull(),
  message: text("reminder_message").notNull(),
  trigger: text("reminder_trigger", { mode: "json" })
    .$type<{
      type: ReminderTriggerType;
      data: ReminderTriggerInputData[keyof ReminderTriggerInputData];
    }>()
    .notNull(),
  reminderCreatedAt: text("reminder_created_at", { mode: "json" })
    .$type<IDateTime>()
    .notNull(),
  isActive: text("reminder_is_active").notNull(),
  actions: text("reminder_actions", { mode: "json" })
    .$type<IReminderAction[]>()
    .notNull(),
  createdAt: text("reminder_created_at").notNull(),
  updatedAt: text("reminder_updated_at").notNull(),
});
