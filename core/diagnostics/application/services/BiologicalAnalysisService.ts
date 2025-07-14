import { AppServiceResponse, Message, UseCase } from "@/core/shared";
import { MakeBiologicalInterpretationRequest, MakeBiologicalInterpretationResponse } from "../useCases";
import { IBiologicalAnalysisAppService } from "./interfaces";
import { BiologicalAnalysisInterpretationDto } from "../dtos";

export interface BiologicalAnalysisAppServiceUseCases {
    makeInterpretation: UseCase<MakeBiologicalInterpretationRequest, MakeBiologicalInterpretationResponse>

}

export class BiologicalAnalysisAppService implements IBiologicalAnalysisAppService {
    constructor(private readonly ucs: BiologicalAnalysisAppServiceUseCases) { }

    async makeInterpretation(req: MakeBiologicalInterpretationRequest): Promise<AppServiceResponse<BiologicalAnalysisInterpretationDto[]> | Message> {
        const res = await this.ucs.makeInterpretation.execute(req);
        if (res.isRight()) return { data: res.value.val };
        else return new Message("error", JSON.stringify((res.value as any)?.err));

    }
}