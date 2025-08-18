import {
  ApplicationMapper,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { DeleteIndicatorRequest } from "./Request";
import { DeleteIndicatorResponse } from "./Response";
import { Indicator, IndicatorRepository } from "../../../../../domain";
import { IndicatorDto } from "../../../../dtos";

export class DeleteIndicatorUseCase
  implements UseCase<DeleteIndicatorRequest, DeleteIndicatorResponse>
{
  constructor(
    private readonly repo: IndicatorRepository,
    private readonly mapper: ApplicationMapper<Indicator, IndicatorDto>
  ) {}
  async execute(
    request: DeleteIndicatorRequest
  ): Promise<DeleteIndicatorResponse> {
    try {
      const indicator = await this.repo.getById(request.id);
      indicator.delete();
      await this.repo.delete(request.id);
      const indicatorDto = this.mapper.toResponse(indicator);
      return right(Result.ok(indicatorDto));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
