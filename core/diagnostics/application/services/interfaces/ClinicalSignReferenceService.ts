import { AggregateID, AppServiceResponse, Message } from "@shared";
import {
  CreateClinicalSignReferenceRequest,
  DeleteClinicalSignReferenceRequest,
  GetClinicalSignReferenceRequest,
  UpdateClinicalSignReferenceRequest,
} from "../../useCases";
import { ClinicalSignReferenceDto } from "../../dtos";

export interface IClinicalSignReferenceService {
  create(
    req: CreateClinicalSignReferenceRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message>;
  get(
    req: GetClinicalSignReferenceRequest
  ): Promise<AppServiceResponse<ClinicalSignReferenceDto[]> | Message>;
  update(
    req: UpdateClinicalSignReferenceRequest
  ): Promise<AppServiceResponse<ClinicalSignReferenceDto> | Message>;
  delete(
    req: DeleteClinicalSignReferenceRequest
  ): Promise<AppServiceResponse<ClinicalSignReferenceDto> | Message>;
}
