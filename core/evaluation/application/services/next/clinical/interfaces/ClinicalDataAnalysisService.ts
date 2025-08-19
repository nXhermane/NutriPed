import { AppServiceResponse, Message } from "@/core/shared";
import { NextClinicalUseCase } from "../../../../useCases/next";
import { NextClinicalDtos } from "../../../../dtos";

export interface IClinicalAnalysisService {
    evaluate(req: NextClinicalUseCase.MakeClinicalEvaluationRequest): Promise<AppServiceResponse<NextClinicalDtos.ClinicalEvaluationResultDto[]> | Message>
    interpret(req: NextClinicalUseCase.MakeClinicalInterpretationRequest): Promise<AppServiceResponse<NextClinicalDtos.ClinicalNutritionalAnalysisDto[]> | Message>
}