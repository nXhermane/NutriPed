import { AggregateID, IDateTime } from "@shared"
import { IReminderAction, ReminderRepeat } from "../../domain"

export interface ReminderDto {
    id: AggregateID
    title: string
    message: string
    scheduledTime: IDateTime
    isActive: boolean
    actions: IReminderAction[]
    repeat: ReminderRepeat
    createdAt: IDateTime 
}