import { handleError, left, Result, right, UseCase } from "@shared";
import { EvaluatePatientAppetiteRequest } from "./Request";
import { EvaluatePatientAppetiteResponse } from "./Response";
import {
  EvaluateAppetiteRequest,
  EvaluateAppetiteResponse,
} from "../../../appetiteTest";
import {
  APPETITE_TEST_RESULT_CODES,
  AppetiteTestResult,
  IPatientDailyJournalGenerator,
  PatientCareSessionRepository,
} from "../../../../../domain";
import { AnthroSystemCodes } from "../../../../../../constants";

export class EvaluatePatientAppetiteUseCase
  implements
    UseCase<EvaluatePatientAppetiteRequest, EvaluatePatientAppetiteResponse>
{
  constructor(
    private readonly evaluateAppetiteUseCase: UseCase<
      EvaluateAppetiteRequest,
      EvaluateAppetiteResponse
    >,
    private readonly dailyJournalGenerator: IPatientDailyJournalGenerator,
    private readonly repo: PatientCareSessionRepository
  ) {}

  async execute(
    request: EvaluatePatientAppetiteRequest
  ): Promise<EvaluatePatientAppetiteResponse> {
    try {
      const patientCareSession = await this.repo.getByIdOrPatientId(
        request.patientCareOrPatientId
      );
      const result =
        this.dailyJournalGenerator.createDailyJournalIfNeeded(
          patientCareSession
        );
      if (result.isFailure) return left(result);
      if (patientCareSession.isNotReady())
        return left(
          Result.fail(
            "The Patient Care Session is not ready to make appetite test."
          )
        );

      const anthropometricVariables = patientCareSession
        .getCurrentState()
        .getAnthroVariables();

      const appetiteEvaluationResult = await this.evaluateAppetite({
        ...request.data,
        patientWeight: anthropometricVariables[AnthroSystemCodes.WEIGHT],
      });
      if (appetiteEvaluationResult.isFailure)
        return left(appetiteEvaluationResult);

      const appetiteTestResultProps = appetiteEvaluationResult.val;
      const appetiteTestResultRes = AppetiteTestResult.create(
        appetiteTestResultProps
      );
      if (appetiteTestResultRes.isFailure) return left(appetiteTestResultRes);

      const appetiteTestResult = appetiteTestResultRes.val;
      patientCareSession.addAppetiteTestToJournal(appetiteTestResult);

      await this.repo.save(patientCareSession);

      return right(Result.ok(appetiteTestResultProps));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
  private async evaluateAppetite(
    data: EvaluateAppetiteRequest
  ): Promise<Result<{ code: string; result: APPETITE_TEST_RESULT_CODES }>> {
    try {
      const response = await this.evaluateAppetiteUseCase.execute(data);
      if (response.isRight()) {
        return Result.ok(response.value.val);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return Result.fail((response.value as any).err);
      }
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
