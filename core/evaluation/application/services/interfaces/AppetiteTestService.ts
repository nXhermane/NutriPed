import { AggregateID, AppServiceResponse, Message } from "@shared";
import {
  CreateAppetiteTestRequest,
  GetAppetiteTestRequest,
  EvaluateAppetiteRequest,
  AppetiteTestResultDto,
} from "../../useCases";
import { AppetiteTestRefDto } from "../../dtos";

export interface IAppetiteTestAppService {
  create(
    req: CreateAppetiteTestRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message>;
  get(
    req: GetAppetiteTestRequest
  ): Promise<AppServiceResponse<AppetiteTestRefDto> | Message>;
  evaluateAppetite(
    req: EvaluateAppetiteRequest
  ): Promise<AppServiceResponse<AppetiteTestResultDto> | Message>;
}
