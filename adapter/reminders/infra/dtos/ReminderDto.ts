import { IReminderAction, ReminderRepeat } from "@/core/reminders"
import { IDateTime } from "@shared"

export interface ReminderPersistenceDto {
    id: string
    title: string
    message: string
    scheduledTime: IDateTime
    reminderCreatedAt: IDateTime
    repeat: ReminderRepeat
    isActive: boolean
    actions: IReminderAction[]
    createdAt: string 
    updatedAt: string 
}