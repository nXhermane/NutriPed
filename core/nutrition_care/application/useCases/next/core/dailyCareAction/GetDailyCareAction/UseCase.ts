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
import { DailyCareAction } from "@/core/nutrition_care/domain/next";
import { NextCoreDtos } from "@/core/nutrition_care/application/dtos";
import { NextCore } from "@/core/nutrition_care/domain";

export class GetDailyCareActionUseCase
  implements UseCase<GetDailyCareActionRequest, GetDailyCareActionResponse>
{
  constructor(
    private readonly dailyCareActionRepository: NextCore.DailyCareActionRepository,
    private readonly dailyCareActionMapper: ApplicationMapper<
      DailyCareAction,
      NextCoreDtos.DailyCareActionDto
    >
  ) {}

  async execute(
    request: GetDailyCareActionRequest
  ): Promise<GetDailyCareActionResponse> {
    try {
      const action = await this.dailyCareActionRepository.getById(
        request.actionId
      );
      const actionDto = this.dailyCareActionMapper.toResponse(action);

      return right(Result.ok(actionDto));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
