import { AggregateID, AppServiceResponse, Message } from "@shared";
import {
   CreateGrowthReferenceTableRequest,
   DeleteGrowthReferenceTableRequest,
   GetGrowthReferenceTableRequest,
   UpdateGrowthReferenceTableRequest,
} from "../../useCases";
import { GrowthReferenceTableDto } from "../../dtos";

export interface IGrowthReferenceTableService {
   create(req: CreateGrowthReferenceTableRequest): Promise<AppServiceResponse<{ id: AggregateID }> | Message>;
   get(req: GetGrowthReferenceTableRequest): Promise<AppServiceResponse<GrowthReferenceTableDto[]> | Message>;
   update(req: UpdateGrowthReferenceTableRequest): Promise<AppServiceResponse<GrowthReferenceTableDto> | Message>;
   delete(req: DeleteGrowthReferenceTableRequest): Promise<AppServiceResponse<GrowthReferenceTableDto> | Message>;
}
