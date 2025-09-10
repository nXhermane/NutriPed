import {
  ApplicationMapper,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@/core/shared";
import { GetMonitoringParameterRequest } from "./Request";
import { GetMonitoringParameterResponse } from "./Response";
import { MonitoringParameterRepository } from "@/core/nutrition_care/domain/next/core/ports/secondary/repositories";
import { MonitoringParameter } from "@/core/nutrition_care/domain/next";
import { MonitoringParameterDto } from "@/core/nutrition_care/application/dtos";

export class GetMonitoringParameterUseCase
  implements
    UseCase<GetMonitoringParameterRequest, GetMonitoringParameterResponse>
{
  constructor(
    private readonly monitoringParameterRepository: MonitoringParameterRepository,
    private readonly monitoringParameterMapper: ApplicationMapper<
      MonitoringParameter,
      MonitoringParameterDto
    >
  ) {}

  async execute(
    request: GetMonitoringParameterRequest
  ): Promise<GetMonitoringParameterResponse> {
    try {
      const entity = await this.monitoringParameterRepository.getById(
        request.monitoringParameterId
      );
      const entityDto = this.monitoringParameterMapper.toResponse(entity);

      return right(Result.ok(entityDto));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
