/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggregateID, AppServiceResponse, Message, UseCase } from "@shared";
import {
   CreateIndicatorRequest,
   CreateIndicatorResponse,
   DeleteIndicatorRequest,
   DeleteIndicatorResponse,
   GetIndicatorRequest,
   GetIndicatorResponse,
   UpdateIndicatorRequest,
   UpdateIndicatorResponse,
} from "../useCases";
import { IIndicatorService } from "./interfaces";
import { IndicatorDto } from "../dtos";

export interface IndicatorServiceUseCases {
   createUC: UseCase<CreateIndicatorRequest, CreateIndicatorResponse>;
   getUC: UseCase<GetIndicatorRequest, GetIndicatorResponse>;
   updateUC: UseCase<UpdateIndicatorRequest, UpdateIndicatorResponse>;
   deleteUC: UseCase<DeleteIndicatorRequest, DeleteIndicatorResponse>;
}
export class IndicatorService implements IIndicatorService {
   constructor(private readonly ucs: IndicatorServiceUseCases) {}
   async create(req: CreateIndicatorRequest): Promise<AppServiceResponse<{ id: AggregateID }> | Message> {
      const res = await this.ucs.createUC.execute(req);
      if (res.isRight()) return { data: res.value.val };
      else return new Message("error", JSON.stringify((res.value as any)?.err));
   }
   async get(req: GetIndicatorRequest): Promise<AppServiceResponse<IndicatorDto[]> | Message> {
      const res = await this.ucs.getUC.execute(req);
      if (res.isRight()) return { data: res.value.val };
      else return new Message("error", JSON.stringify((res.value as any)?.err));
   }
   async update(req: UpdateIndicatorRequest): Promise<AppServiceResponse<IndicatorDto> | Message> {
      const res = await this.ucs.updateUC.execute(req);
      if (res.isRight()) return { data: res.value.val };
      else return new Message("error", JSON.stringify((res.value as any)?.err));
   }
   async delete(req: DeleteIndicatorRequest): Promise<AppServiceResponse<IndicatorDto> | Message> {
      const res = await this.ucs.deleteUC.execute(req);
      if (res.isRight()) return { data: res.value.val };
      else return new Message("error", JSON.stringify((res.value as any)?.err));
   }
}
