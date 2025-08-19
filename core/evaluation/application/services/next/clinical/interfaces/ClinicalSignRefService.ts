import { NextClinicalDtos } from "@/core/evaluation/application/dtos";
import { NextClinicalUseCase } from "@/core/evaluation/application/useCases/next";
import { AggregateID, ApplicationMapper, AppServiceResponse, Message } from "@/core/shared";

export interface IClinicalSignRefService {
    create(req: NextClinicalUseCase.CreateClinicalSignReferenceRequest): Promise<AppServiceResponse<{ id: AggregateID }> | Message>
    get(req: NextClinicalUseCase.GetClinicalSignReferenceRequest): Promise<AppServiceResponse<NextClinicalDtos.ClinicalSignReferenceDto[]> | Message>
}