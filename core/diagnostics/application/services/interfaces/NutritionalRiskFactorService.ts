import { AggregateID, AppServiceResponse, Message } from "@shared";
import {
   CreateNutritionalRiskFactorRequest,
   DeleteNutritionalRiskFactorRequest,
   GetNutritionalRiskFactorRequest,
   UpdateNutritionalRiskFactorRequest,
} from "../../useCases";
import { NutritionalRiskFactorDto } from "../../dtos";

export interface INutritionalRiskFactorService {
   create(req: CreateNutritionalRiskFactorRequest): Promise<AppServiceResponse<{ id: AggregateID }> | Message>;
   get(req: GetNutritionalRiskFactorRequest): Promise<AppServiceResponse<NutritionalRiskFactorDto[]> | Message>;
   update(req: UpdateNutritionalRiskFactorRequest): Promise<AppServiceResponse<NutritionalRiskFactorDto> | Message>;
   delete(req: DeleteNutritionalRiskFactorRequest): Promise<AppServiceResponse<NutritionalRiskFactorDto> | Message>;
}
