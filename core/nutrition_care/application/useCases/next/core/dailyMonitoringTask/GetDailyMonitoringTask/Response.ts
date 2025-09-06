import { Either, ExceptionBase, Result } from "@/core/shared";
import { DailyMonitoringTaskDto } from "@/core/nutrition_care/application/dtos";

export type GetDailyMonitoringTaskResponse = Either<
  ExceptionBase | unknown,
  Result<DailyMonitoringTaskDto>
>;
