import { AggregateID, AppServiceResponse, Message } from "@shared";
import {
  CreateBiochemicalReferenceRequest,
  DeleteBiochemicalReferenceRequest,
  GetBiochemicalReferenceRequest,
  UpdateBiochemicalReferenceRequest,
} from "../../useCases";
import { BiochemicalReferenceDto } from "../../dtos";

export interface IBiochemicalReferenceService {
  create(
    req: CreateBiochemicalReferenceRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message>;
  get(
    req: GetBiochemicalReferenceRequest
  ): Promise<AppServiceResponse<BiochemicalReferenceDto[]> | Message>;
  update(
    req: UpdateBiochemicalReferenceRequest
  ): Promise<AppServiceResponse<BiochemicalReferenceDto> | Message>;
  delete(
    req: DeleteBiochemicalReferenceRequest
  ): Promise<AppServiceResponse<BiochemicalReferenceDto> | Message>;
}
