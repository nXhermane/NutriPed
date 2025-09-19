import { AggregateID } from "@shared";
import { ReminderDto } from "../../../dtos";

export type UpdateReminderRequest = {
  id: AggregateID;
  data: Partial<Omit<ReminderDto, "id" | "createdAt">>;
};
