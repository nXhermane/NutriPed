import { Result } from "@/core/shared";
import { DailyMonitoringTask, MonitoringParameter } from "../../models";

export interface IDailyTaskGeneratorService {
    generate(parameter: MonitoringParameter): Promise<Result<DailyMonitoringTask>>;
}