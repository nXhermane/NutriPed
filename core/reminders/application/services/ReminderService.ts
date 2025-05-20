import { AggregateID, AppServiceResponse, Message, UseCase } from "@shared";
import { CreateReminderRequest, CreateReminderResponse, DeleteReminderRequest, DeleteReminderResponse, GetReminderRequest, GetReminderResponse, UpdateReminderRequest, UpdateReminderResponse } from "../useCases";
import { IReminderAppService } from "./interfaces";
import { ReminderDto } from "../dtos";

export interface ReminderAppServiceUseCases {
    createUC: UseCase<CreateReminderRequest, CreateReminderResponse>
    getUC: UseCase<GetReminderRequest, GetReminderResponse>
    updateUC: UseCase<UpdateReminderRequest, UpdateReminderResponse>
    deleteUC: UseCase<DeleteReminderRequest, DeleteReminderResponse>

}

export class ReminderAppService implements IReminderAppService {
    constructor(private readonly ucs: ReminderAppServiceUseCases) { }
    async create(req: CreateReminderRequest): Promise<AppServiceResponse<{ id: AggregateID; }> | Message> {
        const res = await this.ucs.createUC.execute(req);
        if (res.isRight()) return { data: res.value.val };
        else return new Message("error", JSON.stringify((res.value as any)?.err));
    }
    async get(req: GetReminderRequest): Promise<AppServiceResponse<ReminderDto[]> | Message> {
        const res = await this.ucs.getUC.execute(req);
        if (res.isRight()) return { data: res.value.val };
        else return new Message("error", JSON.stringify((res.value as any)?.err));
    }
    async delete(req: DeleteReminderRequest): Promise<AppServiceResponse<void> | Message> {
        const res = await this.ucs.deleteUC.execute(req);
        if (res.isRight()) return { data: res.value.val };
        else return new Message("error", JSON.stringify((res.value as any)?.err));
    }
    async update(req: UpdateReminderRequest): Promise<AppServiceResponse<void> | Message> {
        const res = await this.ucs.updateUC.execute(req);
        if (res.isRight()) return { data: res.value.val };
        else return new Message("error", JSON.stringify((res.value as any)?.err));
    }

}