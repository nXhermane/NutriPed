import { AggregateID, AppServiceResponse, Message } from "@shared";
import { CreateMilkRequest, GetMilkRequest, SuggestMilkRequest } from "../../useCases";
import { MilkDto, MilkSuggestionResultDto } from "../../dtos";

export interface IMilkAppService {
   create(req: CreateMilkRequest): Promise<AppServiceResponse<{ id: AggregateID }> | Message>;
   get(req: GetMilkRequest): Promise<AppServiceResponse<MilkDto[]> | Message>;
   suggestMilk(req: SuggestMilkRequest): Promise<AppServiceResponse<MilkSuggestionResultDto> | Message>;
}
