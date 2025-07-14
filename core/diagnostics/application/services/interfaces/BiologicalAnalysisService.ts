import { AppServiceResponse, Message } from "@/core/shared";
import { MakeBiologicalInterpretationRequest } from "../../useCases";
import { BiologicalAnalysisInterpretationDto } from "../../dtos";

export interface IBiologicalAnalysisAppService {
    makeInterpretation(req: MakeBiologicalInterpretationRequest): Promise<AppServiceResponse<BiologicalAnalysisInterpretationDto[]> | Message>
}