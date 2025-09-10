import {
  ApplicationMapper,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@/core/shared";
import { GetPatientCareSessionRequest } from "./Request";
import { GetPatientCareSessionResponse } from "./Response";
import { PatientCareSessionRepository } from "@/core/nutrition_care/domain/next/core/ports/secondary/repositories";
import { NextCore } from "@/core/nutrition_care/domain";
import { NextCoreDtos } from "@/core/nutrition_care/application/dtos";

export class GetPatientCareSessionUseCase
  implements
    UseCase<GetPatientCareSessionRequest, GetPatientCareSessionResponse>
{
  constructor(
    private readonly patientCareSessionRepository: PatientCareSessionRepository,
    private readonly patientCareSessionMapper: ApplicationMapper<
      NextCore.PatientCareSession,
      NextCoreDtos.PatientCareSessionAggregateDto
    >
  ) {}

  async execute(
    request: GetPatientCareSessionRequest
  ): Promise<GetPatientCareSessionResponse> {
    try {
      const entity = await this.patientCareSessionRepository.getById(
        request.patientCareSessionId
      );
      const entityDto = this.patientCareSessionMapper.toResponse(entity);

      return right(Result.ok(entityDto));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
