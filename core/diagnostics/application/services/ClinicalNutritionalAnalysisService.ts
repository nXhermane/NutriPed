import { AppServiceResponse, Message, UseCase } from "@/core/shared";
import {
  MakeClinicalAnalysisRequest,
  MakeClinicalAnalysisResponse,
} from "../useCases";
import { IClinicalNutritionalAnalysisAppService } from "./interfaces";
import { ClinicalNutritionalAnalysisResultDto } from "../dtos";

export interface ClinicalNutritionalAnalysisAppServiceUseCases {
  makeClinicalAnalysis: UseCase<
    MakeClinicalAnalysisRequest,
    MakeClinicalAnalysisResponse
  >;
}

export class ClinicalNutritionalAnalysisAppService
  implements IClinicalNutritionalAnalysisAppService
{
  constructor(
    private readonly ucs: ClinicalNutritionalAnalysisAppServiceUseCases
  ) {}

  async makeClinicalAnalysis(
    req: MakeClinicalAnalysisRequest
  ): Promise<
    AppServiceResponse<ClinicalNutritionalAnalysisResultDto[]> | Message
  > {
    const res = await this.ucs.makeClinicalAnalysis.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}
