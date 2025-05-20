import { IReminderAction } from "@/core/reminders";
import { IDateTime } from "@shared";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const reminders = sqliteTable('reminders', {
    id: text("reminder_id").primaryKey(),
    title: text("reminder_title").notNull(),
    message: text("reminder_message").notNull(),
    scheduledTime: text("reminder_scheduled_time", { mode: 'json' }).$type<IDateTime>().notNull(),
    reminderCreatedAt: text("reminder_created_at", { mode: "json" }).$type<IDateTime>().notNull(),
    repeat: text("reminder_repeat").notNull(),
    isActive: text("reminder_is_active").notNull(),
    actions: text("reminder_actions", { mode: 'json' }).$type<IReminderAction[]>().notNull(),
    createdAt: text("reminder_created_at").notNull(),
    updatedAt: text("reminder_updated_at").notNull(),
})