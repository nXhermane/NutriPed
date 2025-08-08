import { handleError, left, Result, right, UseCase } from "@/core/shared";
import { GetDailyJouranlResponse } from "./Response";
import { GetDailyJournalRequest } from "./Request";
import { GetPatientCareSessionRequest } from "../Get/Request";
import { GetPatientCareSessionResponse } from "../Get/Response";

export class GetDailyJournalUseCase
  implements UseCase<GetDailyJournalRequest, GetDailyJouranlResponse>
{
  constructor(
    private readonly getPatientCareSessionUC: UseCase<
      GetPatientCareSessionRequest,
      GetPatientCareSessionResponse
    >
  ) {}

  async execute(
    request: GetDailyJournalRequest
  ): Promise<GetDailyJouranlResponse> {
    try {
      const result = await this.getPatientCareSessionUC.execute(request);
      if (result.isRight()) {
        const patientCareSession = result.value.val;
        return right(
          Result.ok({
            current: patientCareSession.currentDailyJournal,
            previeous: patientCareSession.dailyJournals,
          })
        );
      } else {
        return left(result.value);
      }
    } catch (e) {
      return left(handleError(e));
    }
  }
}
