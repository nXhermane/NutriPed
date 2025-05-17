/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggregateID, AppServiceResponse, Message, UseCase } from "@shared";
import {
   CreateGrowthReferenceChartRequest,
   CreateGrowthReferenceChartResponse,
   DeleteGrowthReferenceChartRequest,
   DeleteGrowthReferenceChartResponse,
   GetGrowthReferenceChartRequest,
   GetGrowthReferenceChartResponse,
   UpdateGrowthReferenceChartRequest,
   UpdateGrowthReferenceChartResponse,
} from "../useCases";
import { IGrowthReferenceChartService } from "./interfaces";
import { GrowthReferenceChartDto } from "../dtos";

export interface GrowthReferenceTChartServiceUseCases {
   createUC: UseCase<CreateGrowthReferenceChartRequest, CreateGrowthReferenceChartResponse>;
   getUC: UseCase<GetGrowthReferenceChartRequest, GetGrowthReferenceChartResponse>;
   deleteUC: UseCase<DeleteGrowthReferenceChartRequest, DeleteGrowthReferenceChartResponse>;
   updateUC: UseCase<UpdateGrowthReferenceChartRequest, UpdateGrowthReferenceChartResponse>;
}
export class GrowthReferenceChartService implements IGrowthReferenceChartService {
   constructor(private readonly ucs: GrowthReferenceTChartServiceUseCases) {}
   async create(req: CreateGrowthReferenceChartRequest): Promise<AppServiceResponse<{ id: AggregateID }> | Message> {
      const res = await this.ucs.createUC.execute(req);
      if (res.isRight()) return { data: res.value.val };
      else return new Message("error", JSON.stringify((res.value as any)?.err));
   }
   async get(req: GetGrowthReferenceChartRequest): Promise<AppServiceResponse<GrowthReferenceChartDto[]> | Message> {
      const res = await this.ucs.getUC.execute(req);
      if (res.isRight()) return { data: res.value.val };
      else return new Message("error", JSON.stringify((res.value as any)?.err));
   }
   async update(req: UpdateGrowthReferenceChartRequest): Promise<AppServiceResponse<GrowthReferenceChartDto> | Message> {
      const res = await this.ucs.updateUC.execute(req);
      if (res.isRight()) return { data: res.value.val };
      else return new Message("error", JSON.stringify((res.value as any)?.err));
   }
   async delete(req: DeleteGrowthReferenceChartRequest): Promise<AppServiceResponse<GrowthReferenceChartDto> | Message> {
      const res = await this.ucs.deleteUC.execute(req);
      if (res.isRight()) return { data: res.value.val };
      else return new Message("error", JSON.stringify((res.value as any)?.err));
   }
}
