/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggregateID, AppServiceResponse, Message, UseCase } from "@shared";
import {
   CreateBiochemicalReferenceRequest,
   CreateBiochemicalReferenceResponse,
   DeleteBiochemicalReferenceRequest,
   DeleteBiochemicalReferenceResponse,
   GetBiochemicalReferenceRequest,
   GetBiochemicalReferenceResponse,
   UpdateBiochemicalReferenceRequest,
   UpdateBiochemicalReferenceResponse,
} from "../useCases";
import { IBiochemicalReferenceService } from "./interfaces";
import { BiochemicalReferenceDto } from "../dtos";

export interface BiochemicalReferenceServiceUseCases {
   createUC: UseCase<CreateBiochemicalReferenceRequest, CreateBiochemicalReferenceResponse>;
   getUC: UseCase<GetBiochemicalReferenceRequest, GetBiochemicalReferenceResponse>;
   updateUC: UseCase<UpdateBiochemicalReferenceRequest, UpdateBiochemicalReferenceResponse>;
   deleteUC: UseCase<DeleteBiochemicalReferenceRequest, DeleteBiochemicalReferenceResponse>;
}

export class BiochemicalReferenceService implements IBiochemicalReferenceService {
    constructor(private readonly ucs: BiochemicalReferenceServiceUseCases) {}
    async create(req: CreateBiochemicalReferenceRequest): Promise<AppServiceResponse<{ id: AggregateID; }> | Message> {
        const res = await this.ucs.createUC.execute(req);
        if (res.isRight()) return { data: res.value.val };
        else return new Message("error", JSON.stringify((res.value as any)?.err));
    }
    async get(req: GetBiochemicalReferenceRequest): Promise<AppServiceResponse<BiochemicalReferenceDto[]> | Message> {
        const res = await this.ucs.getUC.execute(req);
        if (res.isRight()) return { data: res.value.val };
        else return new Message("error", JSON.stringify((res.value as any)?.err));
    }
    async update(req: UpdateBiochemicalReferenceRequest): Promise<AppServiceResponse<BiochemicalReferenceDto> | Message> {
        const res = await this.ucs.updateUC.execute(req);
        if (res.isRight()) return { data: res.value.val };
        else return new Message("error", JSON.stringify((res.value as any)?.err));
    }
    async delete(req: DeleteBiochemicalReferenceRequest): Promise<AppServiceResponse<BiochemicalReferenceDto> | Message> {
        const res = await this.ucs.deleteUC.execute(req);
        if (res.isRight()) return { data: res.value.val };
        else return new Message("error", JSON.stringify((res.value as any)?.err));
    }
}