import {
  ApplicationMapper,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { GetPatientCareSessionRequest } from "./Request";
import { GetPatientCareSessionResponse } from "./Response";
import {
  IPatientDailyJournalGenerator,
  PatientCareSession,
  PatientCareSessionRepository,
} from "../../../../../domain";
import { PatientCareSessionDto } from "../../../../dtos";

export class GetPatientCareSessionUseCase
  implements
    UseCase<GetPatientCareSessionRequest, GetPatientCareSessionResponse>
{
  constructor(
    private readonly repo: PatientCareSessionRepository,
    private readonly mapper: ApplicationMapper<
      PatientCareSession,
      PatientCareSessionDto
    >,
    private readonly dailyJournalService: IPatientDailyJournalGenerator
  ) {}
  async execute(
    request: GetPatientCareSessionRequest
  ): Promise<GetPatientCareSessionResponse> {
    try {
      const patientCareSession = await this.repo.getByIdOrPatientId(
        request.patientIdOrSessionId
      );

      const dailyJournalResult =
        this.dailyJournalService.createDailyJournalIfNeeded(patientCareSession);
      if (dailyJournalResult.isFailure) return left(dailyJournalResult);

      return right(Result.ok(this.mapper.toResponse(patientCareSession)));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
