/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggregateID, AppServiceResponse, Message, UseCase } from "@shared";
import {
   CreateGrowthReferenceTableRequest,
   CreateGrowthReferenceTableResponse,
   DeleteGrowthReferenceTableRequest,
   DeleteGrowthReferenceTableResponse,
   GetGrowthReferenceTableRequest,
   GetGrowthReferenceTableResponse,
   UpdateGrowthReferenceTableRequest,
   UpdateGrowthReferenceTableResponse,
} from "../useCases";
import { IGrowthReferenceTableService } from "./interfaces";
import { GrowthReferenceTableDto } from "../dtos";

export interface GrowthReferenceTableServiceUseCases {
   createUC: UseCase<CreateGrowthReferenceTableRequest, CreateGrowthReferenceTableResponse>;
   getUC: UseCase<GetGrowthReferenceTableRequest, GetGrowthReferenceTableResponse>;
   deleteUC: UseCase<DeleteGrowthReferenceTableRequest, DeleteGrowthReferenceTableResponse>;
   updateUC: UseCase<UpdateGrowthReferenceTableRequest, UpdateGrowthReferenceTableResponse>;
}
export class GrowthReferenceTableService implements IGrowthReferenceTableService {
   constructor(private readonly ucs: GrowthReferenceTableServiceUseCases) {}
   async create(req: CreateGrowthReferenceTableRequest): Promise<AppServiceResponse<{ id: AggregateID }> | Message> {
      const res = await this.ucs.createUC.execute(req);
      if (res.isRight()) return { data: res.value.val };
      else return new Message("error", JSON.stringify((res.value as any)?.err));
   }
   async get(req: GetGrowthReferenceTableRequest): Promise<AppServiceResponse<GrowthReferenceTableDto[]> | Message> {
      const res = await this.ucs.getUC.execute(req);
      if (res.isRight()) return { data: res.value.val };
      else return new Message("error", JSON.stringify((res.value as any)?.err));
   }
   async update(req: UpdateGrowthReferenceTableRequest): Promise<AppServiceResponse<GrowthReferenceTableDto> | Message> {
      const res = await this.ucs.updateUC.execute(req);
      if (res.isRight()) return { data: res.value.val };
      else return new Message("error", JSON.stringify((res.value as any)?.err));
   }
   async delete(req: DeleteGrowthReferenceTableRequest): Promise<AppServiceResponse<GrowthReferenceTableDto> | Message> {
      const res = await this.ucs.deleteUC.execute(req);
      if (res.isRight()) return { data: res.value.val };
      else return new Message("error", JSON.stringify((res.value as any)?.err));
   }
}
