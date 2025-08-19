import { AppServiceResponse, Message, UseCase } from "@/core/shared";
import { NextClinicalUseCase } from "../../../useCases/next";
import { IClinicalAnalysisService } from "./interfaces";
import { ClinicalEvaluationResultDto, ClinicalNutritionalAnalysisDto } from "../../../dtos/next/clinical";

export interface ClinicalDataAnalysisServiceUseCases {
    evaluateUC: UseCase<NextClinicalUseCase.MakeClinicalEvaluationRequest, NextClinicalUseCase.MakeClinicalEvaluationResponse>
    interpretUC: UseCase<NextClinicalUseCase.MakeClinicalInterpretationRequest, NextClinicalUseCase.MakeClinicalInterpretationResponse>
}

export class ClinicalDataAnalysisService implements IClinicalAnalysisService {
    constructor(private readonly ucs: ClinicalDataAnalysisServiceUseCases) { }
    async evaluate(req: NextClinicalUseCase.MakeClinicalEvaluationRequest): Promise<AppServiceResponse<ClinicalEvaluationResultDto[]> | Message> {
        const res = await this.ucs.evaluateUC.execute(req);
        if (res.isRight()) return { data: res.value.val };
        else return new Message("error", JSON.stringify((res.value as any).err));
    }
    async interpret(req: NextClinicalUseCase.MakeClinicalInterpretationRequest): Promise<AppServiceResponse<ClinicalNutritionalAnalysisDto[]> | Message> {
        const res = await this.ucs.interpretUC.execute(req);
        if (res.isRight()) return { data: res.value.val };
        else return new Message("error", JSON.stringify((res.value as any).err));
    }
}

