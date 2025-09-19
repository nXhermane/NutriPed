import { AggregateID, AppServiceResponse, Message } from "@shared";
import {
  CreateAnthropometricMeasureRequest,
  DeleteAnthropometricMeasureRequest,
  GetAnthropometricMeasureRequest,
  UpdateAnthropometricMeasureRequest,
} from "../../useCases";
import { AnthropometricMeasureDto } from "../../dtos";

export interface IAnthropometricMeasureService {
  create(
    req: CreateAnthropometricMeasureRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message>;
  get(
    req: GetAnthropometricMeasureRequest
  ): Promise<AppServiceResponse<AnthropometricMeasureDto[]> | Message>;
  update(
    req: UpdateAnthropometricMeasureRequest
  ): Promise<AppServiceResponse<AnthropometricMeasureDto> | Message>;
  delete(
    req: DeleteAnthropometricMeasureRequest
  ): Promise<AppServiceResponse<AnthropometricMeasureDto> | Message>;
}
