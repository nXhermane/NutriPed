import { AppServiceResponse, Message } from "@shared";
import {
  GetDailyMonitoringTaskRequest,
} from "../../useCases/next/core/dailyMonitoringTask";
import { DailyMonitoringTaskDto } from "../../dtos";

export interface IDailyMonitoringTaskService {
  getDailyMonitoringTask(
    req: GetDailyMonitoringTaskRequest
  ): Promise<AppServiceResponse<DailyMonitoringTaskDto> | Message>;
}
