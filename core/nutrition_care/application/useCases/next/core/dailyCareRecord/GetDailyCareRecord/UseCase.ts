import {
  ApplicationMapper,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@/core/shared";
import { GetDailyCareRecordRequest } from "./Request";
import { GetDailyCareRecordResponse } from "./Response";
import { DailyCareRecordRepository } from "@/core/nutrition_care/domain/next/core/ports/secondary/repositories";
import { DailyCareRecord } from "@/core/nutrition_care/domain/next";
import { DailyCareRecordDto } from "@/core/nutrition_care/application/dtos";

export class GetDailyCareRecordUseCase
  implements UseCase<GetDailyCareRecordRequest, GetDailyCareRecordResponse>
{
  constructor(
    private readonly dailyCareRecordRepository: DailyCareRecordRepository,
    private readonly dailyCareRecordMapper: ApplicationMapper<
      DailyCareRecord,
      DailyCareRecordDto
    >
  ) {}

  async execute(
    request: GetDailyCareRecordRequest
  ): Promise<GetDailyCareRecordResponse> {
    try {
      const entity = await this.dailyCareRecordRepository.getById(
        request.dailyCareRecordId
      );
      const entityDto = this.dailyCareRecordMapper.toResponse(entity);

      return right(Result.ok(entityDto));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
