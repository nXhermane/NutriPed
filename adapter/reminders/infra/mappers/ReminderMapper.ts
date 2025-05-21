import { Reminder, ReminderTriggerInputData, ReminderTriggerType } from "@/core/reminders";
import { formatError, InfraMapToDomainError, InfrastructureMapper } from "@shared";
import { ReminderPersistenceDto } from "../dtos";

export class ReminderInfraMapper implements InfrastructureMapper<Reminder, ReminderPersistenceDto> {
    toPersistence(entity: Reminder): ReminderPersistenceDto {
        const triggerProps = entity.getTrigger()
        let triggerData: ReminderTriggerInputData[keyof ReminderTriggerInputData]
        switch (triggerProps.type) {
            case ReminderTriggerType.INTERVAL:
                triggerData = {
                    every: triggerProps.data.every.unpack()
                };
                break;
            case ReminderTriggerType.DATE_TIME:
                triggerData = {
                    scheduled: triggerProps.data.scheduled.unpack(), // IDateTime
                };
                break;
            case ReminderTriggerType.RECURRING:
                triggerData = {
                    frequency: triggerProps.data.frequency,
                    time: triggerProps.data.time.time, // string "HH:mm"
                    daysOfWeek: triggerProps.data.daysOfWeek,
                };
                break;
            default:
                throw new Error("Unsupported ReminderTrigger type in toDto()");
        }
        return {
            id: entity.id as string,
            title: entity.getTitle(),
            message: entity.getMessage(),
            trigger: { type: triggerProps.type, data: triggerData },
            isActive: entity.getIsActive(),
            actions: entity.getActions(),
            reminderCreatedAt: entity.getCreatedAt(),
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };
    }

    toDomain(record: ReminderPersistenceDto): Reminder {
        const reminderRes = Reminder.create({ ...record, createdAt: record.reminderCreatedAt }, record.id);
        if (reminderRes.isFailure) throw new InfraMapToDomainError(formatError(reminderRes, ReminderInfraMapper.name));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { createdAt, updatedAt, id, ...props } = reminderRes.val.getProps();
        return new Reminder({ id, props, createdAt: record.createdAt, updatedAt: record.updatedAt });
    }
}