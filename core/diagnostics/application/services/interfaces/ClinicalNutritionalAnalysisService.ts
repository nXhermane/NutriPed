import { AppServiceResponse, Message } from "@/core/shared";
import { MakeClinicalAnalysisRequest } from "../../useCases";
import { ClinicalNutritionalAnalysisResultDto } from "../../dtos";

export interface IClinicalNutritionalAnalysisAppService {
    makeClinicalAnalysis(req: MakeClinicalAnalysisRequest): Promise<AppServiceResponse<ClinicalNutritionalAnalysisResultDto[]> | Message>
}