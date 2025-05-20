import { Repository } from "@shared";
import { Reminder } from "../../../models";

export interface ReminderRepository extends Repository<Reminder> {
    getAll(): Promise<Reminder[]>
    remove(reminder: Reminder): Promise<void>
}