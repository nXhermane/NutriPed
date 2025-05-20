import { Reminder } from "@/core/reminders";
import { formatError, InfraMapToDomainError, InfrastructureMapper } from "@shared";
import { ReminderPersistenceDto } from "../dtos";

export class ReminderInfraMapper implements InfrastructureMapper<Reminder, ReminderPersistenceDto> {
    toPersistence(entity: Reminder): ReminderPersistenceDto {
        return {
            id: entity.id as string,
            title: entity.getTitle(),
            message: entity.getMessage(),
            scheduledTime: entity.getSheduledTime(),
            reminderCreatedAt: entity.getCreatedAt(),
            repeat: entity.getRepeat(),
            isActive: entity.getIsActive(),
            actions: entity.getActions(),
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,

        }
    }

    toDomain(record: ReminderPersistenceDto): Reminder {
        const reminderRes = Reminder.create({ ...record, createdAt: record.reminderCreatedAt }, record.id);
        if (reminderRes.isFailure) throw new InfraMapToDomainError(formatError(reminderRes, ReminderInfraMapper.name));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { createdAt, updatedAt, id, ...props } = reminderRes.val.getProps();
        return new Reminder({ id, props, createdAt: record.createdAt, updatedAt: record.updatedAt });
    }
}