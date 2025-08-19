import { NextClinicalDtos } from "@/core/evaluation/application/dtos";
import { NextClinicalUseCase } from "@/core/evaluation/application/useCases/next";
import { AggregateID, AppServiceResponse, Message } from "@/core/shared";

export interface INutritionalRiskFactorService {
    create(req: NextClinicalUseCase.CreateNutritionalRiskFactorRequest): Promise<AppServiceResponse<{ id: AggregateID }> | Message>
    get(req: NextClinicalUseCase.GetNutritionalRiskFactorRequest): Promise<AppServiceResponse<NextClinicalDtos.NutritionalRiskFactorDto[]> | Message
    >
}