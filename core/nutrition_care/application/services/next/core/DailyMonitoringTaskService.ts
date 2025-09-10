/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppServiceResponse, Message, UseCase } from "@shared";
import { IDailyMonitoringTaskService } from "../../interfaces";
import {
  GetDailyMonitoringTaskRequest,
  GetDailyMonitoringTaskResponse,
} from "../../../useCases/next/core/dailyMonitoringTask";
import { DailyMonitoringTaskDto } from "../../../dtos";

export interface DailyMonitoringTaskServiceUseCases {
  getDailyMonitoringTaskUC: UseCase<
    GetDailyMonitoringTaskRequest,
    GetDailyMonitoringTaskResponse
  >;
}

export class DailyMonitoringTaskService implements IDailyMonitoringTaskService {
  constructor(private readonly ucs: DailyMonitoringTaskServiceUseCases) {}

  async getDailyMonitoringTask(
    req: GetDailyMonitoringTaskRequest
  ): Promise<AppServiceResponse<DailyMonitoringTaskDto> | Message> {
    const res = await this.ucs.getDailyMonitoringTaskUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}
