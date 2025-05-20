import { AggregateID, AppServiceResponse, Message } from "@shared";
import { CreateReminderRequest, DeleteReminderRequest, GetReminderRequest, UpdateReminderRequest } from "../../useCases";
import { ReminderDto } from "../../dtos";

export interface IReminderAppService {
    create(req: CreateReminderRequest): Promise<AppServiceResponse<{ id: AggregateID }> | Message>
    get(req: GetReminderRequest): Promise<AppServiceResponse<ReminderDto[]> | Message>
    delete(req: DeleteReminderRequest): Promise<AppServiceResponse<void> | Message>
    update(req: UpdateReminderRequest): Promise<AppServiceResponse<void> | Message>
}