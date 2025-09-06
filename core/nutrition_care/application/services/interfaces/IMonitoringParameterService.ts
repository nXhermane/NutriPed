import { AppServiceResponse, Message } from "@shared";
import {
  GetMonitoringParameterRequest,
} from "../../useCases/next/core/monitoringParameter";
import { MonitoringParameterDto } from "../../dtos";

export interface IMonitoringParameterService {
  getMonitoringParameter(
    req: GetMonitoringParameterRequest
  ): Promise<AppServiceResponse<MonitoringParameterDto> | Message>;
}
