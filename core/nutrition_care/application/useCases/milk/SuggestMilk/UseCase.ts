import { handleError, left, Result, right, UseCase } from "@shared";
import { SuggestMilkRequest } from "./Request";
import { SuggestMilkResponse } from "./Response";
import {
  ITherapeuticMilkAdvisorService,
  MilkRepository,
  MilkSuggestionInput,
} from "../../../../domain";

export class SuggestMilkUseCase
  implements UseCase<SuggestMilkRequest, SuggestMilkResponse>
{
  constructor(
    private readonly repo: MilkRepository,
    private readonly milkService: ITherapeuticMilkAdvisorService
  ) {}
  async execute(request: MilkSuggestionInput): Promise<SuggestMilkResponse> {
    try {
      const milks = await this.repo.getAll();

      const milkSuggestionResultRes = this.milkService.suggest(request, milks);
      if (milkSuggestionResultRes.isFailure)
        return left(milkSuggestionResultRes);

      return right(Result.ok(milkSuggestionResultRes.val.unpack()));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
