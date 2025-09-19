/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppServiceResponse, Message, UseCase } from "@shared";
import { IMonitoringParameterService } from "../../interfaces";
import {
  GetMonitoringParameterRequest,
  GetMonitoringParameterResponse,
} from "../../../useCases/next/core/monitoringParameter";
import { MonitoringParameterDto } from "../../../dtos";

export interface MonitoringParameterServiceUseCases {
  getMonitoringParameterUC: UseCase<
    GetMonitoringParameterRequest,
    GetMonitoringParameterResponse
  >;
}

export class MonitoringParameterService implements IMonitoringParameterService {
  constructor(private readonly ucs: MonitoringParameterServiceUseCases) {}

  async getMonitoringParameter(
    req: GetMonitoringParameterRequest
  ): Promise<AppServiceResponse<MonitoringParameterDto> | Message> {
    const res = await this.ucs.getMonitoringParameterUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}
