import { AggregateID, AppServiceResponse, Message, UseCase } from "@/core/shared";
import { NextClinicalUseCase } from "../../../useCases/next";
import { INutritionalRiskFactorService } from "./interfaces";
import { NutritionalRiskFactorDto } from "../../../dtos/next/clinical";

export interface NutritionalRiskFactorServiceUseCases {
    createUC: UseCase<NextClinicalUseCase.CreateNutritionalRiskFactorRequest, NextClinicalUseCase.CreateNutritionalRiskFactorResponse>
    getUC: UseCase<NextClinicalUseCase.GetNutritionalRiskFactorRequest, NextClinicalUseCase.GetNutritionalRiskFactorResponse>
}


export class NutritionalRiskFactorService implements INutritionalRiskFactorService {
    constructor(private readonly ucs: NutritionalRiskFactorServiceUseCases
    ) { }
    async create(req: NextClinicalUseCase.CreateNutritionalRiskFactorRequest): Promise<AppServiceResponse<{ id: AggregateID; }> | Message> {
        const res = await this.ucs.createUC.execute(req);
        if (res.isRight()) return { data: res.value.val };
        else return new Message("error", JSON.stringify((res.value as any).err));
    }
    async get(req: NextClinicalUseCase.GetNutritionalRiskFactorRequest): Promise<AppServiceResponse<NutritionalRiskFactorDto[]> | Message> {
        const res = await this.ucs.getUC.execute(req);
        if (res.isRight()) return { data: res.value.val };
        else return new Message("error", JSON.stringify((res.value as any).err));
    }

}