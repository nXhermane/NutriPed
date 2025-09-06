import {
  ApplicationMapper,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@/core/shared";
import { GetDailyCareActionRequest } from "./Request";
import { GetDailyCareActionResponse } from "./Response";
import { DailyCareActionRepository } from "@/core/nutrition_care/domain/next/core/ports/secondary/repositories";
import { DailyCareAction } from "@/core/nutrition_care/domain/next";
import { DailyCareActionDto } from "@/core/nutrition_care/application/dtos";

export class GetDailyCareActionUseCase
  implements
  UseCase<GetDailyCareActionRequest, GetDailyCareActionResponse> {
  constructor(
    private readonly dailyCareActionRepository: DailyCareActionRepository,
    private readonly dailyCareActionMapper: ApplicationMapper<DailyCareAction,DailyCareActionDto>
  ) { }

  async execute(
    request: GetDailyCareActionRequest
  ): Promise<GetDailyCareActionResponse> {
    try {
      const action = await this.dailyCareActionRepository.getById(request.actionId);
      const actionDto = this.dailyCareActionMapper.toResponse(action);

      return right(Result.ok(actionDto));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
