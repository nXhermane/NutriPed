import {
  ApplicationMapper,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@/core/shared";
import { GetDailyMonitoringTaskRequest } from "./Request";
import { GetDailyMonitoringTaskResponse } from "./Response";
import { DailyMonitoringTaskRepository } from "@/core/nutrition_care/domain/next/core/ports/secondary/repositories";
import { DailyMonitoringTask } from "@/core/nutrition_care/domain/next";
import { DailyMonitoringTaskDto } from "@/core/nutrition_care/application/dtos";

export class GetDailyMonitoringTaskUseCase
  implements
    UseCase<GetDailyMonitoringTaskRequest, GetDailyMonitoringTaskResponse>
{
  constructor(
    private readonly dailyMonitoringTaskRepository: DailyMonitoringTaskRepository,
    private readonly dailyMonitoringTaskMapper: ApplicationMapper<
      DailyMonitoringTask,
      DailyMonitoringTaskDto
    >
  ) {}

  async execute(
    request: GetDailyMonitoringTaskRequest
  ): Promise<GetDailyMonitoringTaskResponse> {
    try {
      const entity = await this.dailyMonitoringTaskRepository.getById(
        request.dailyMonitoringTaskId
      );
      const entityDto = this.dailyMonitoringTaskMapper.toResponse(entity);

      return right(Result.ok(entityDto));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
