import { ApplicationMapper, DateTime, IDateTime } from "@/core/shared";
import { Reminder, ReminderTriggerInputData, ReminderTriggerType } from "../../domain";
import { ReminderDto } from "../dtos";

export class ReminderAppMapper
  implements ApplicationMapper<Reminder, ReminderDto> {
  toResponse(entity: Reminder): ReminderDto {
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
      id: entity.id,
      title: entity.getTitle(),
      message: entity.getMessage(),
      trigger: { type: triggerProps.type, data: triggerData },
      isActive: entity.getIsActive(),
      actions: entity.getActions(),
      createdAt: entity.getCreatedAt()
    };
  }
}
