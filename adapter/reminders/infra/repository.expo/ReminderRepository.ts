import { Reminder, ReminderRepository } from "@/core/reminders";
import { EntityBaseRepositoryExpo } from "../../../shared";
import { reminders } from "./db";
import { ReminderPersistenceDto } from "../dtos";

export class ReminderRepositoryExpoImpl extends EntityBaseRepositoryExpo<Reminder, ReminderPersistenceDto, typeof reminders> implements ReminderRepository { }