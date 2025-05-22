import {
  ApplicationMapper,
  handleError,
  left,
  Result,
  right,
  SystemCode,
  UseCase,
} from "@shared";
import { GetIndicatorRequest } from "./Request";
import { GetIndicatorResponse } from "./Response";
import { Indicator, IndicatorRepository } from "../../../../../domain";
import { IndicatorDto } from "../../../../dtos";

export class GetIndicatorUseCase
  implements UseCase<GetIndicatorRequest, GetIndicatorResponse>
{
  constructor(
    private readonly repo: IndicatorRepository,
    private readonly mapper: ApplicationMapper<Indicator, IndicatorDto>
  ) {}
  async execute(request: GetIndicatorRequest): Promise<GetIndicatorResponse> {
    try {
      const indicators: Indicator[] = [];
      if (request.id && !request.code) {
        indicators.push(await this.repo.getById(request.id));
      } else if (request.code && !request.id) {
        const systemCode = SystemCode.create(request.code);
        if (systemCode.isFailure) return left(systemCode);
        indicators.push(await this.repo.getByCode(systemCode.val));
      } else {
        indicators.push(...(await this.repo.getAll()));
      }
      const indicatorsDto = indicators.map(this.mapper.toResponse);
      return right(Result.ok(indicatorsDto));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
