import { ApplicationMapper } from "@/core/shared";
import { Reminder } from "../../domain";
import { ReminderDto } from "../dtos";

export class ReminderAppMapper
  implements ApplicationMapper<Reminder, ReminderDto>
{
  toResponse(entity: Reminder): ReminderDto {
    return {
      id: entity.id,
      title: entity.getTitle(),
      message: entity.getMessage(),
      scheduledTime: entity.getScheduledTime(),
      isActive: entity.getIsActive(),
      repeat: entity.getRepeat(),
      actions: entity.getActions(),
      createdAt: entity.getCreatedAt(),
    };
  }
}
