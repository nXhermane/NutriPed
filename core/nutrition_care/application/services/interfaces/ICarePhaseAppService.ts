import { AggregateID, AppServiceResponse, Message } from "@shared";
import {
  CreateCarePhaseReferenceRequest,
  GetCarePhaseReferenceRequest,
} from "../../useCases/carePhase";
import { CarePhaseReferenceDto } from "../../dtos/carePhase/CarePhaseDto";

export interface ICarePhaseReferenceAppService {
  create(
    req: CreateCarePhaseReferenceRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message>;
  get(
    req: GetCarePhaseReferenceRequest
  ): Promise<AppServiceResponse<CarePhaseReferenceDto[]> | Message>;
}
