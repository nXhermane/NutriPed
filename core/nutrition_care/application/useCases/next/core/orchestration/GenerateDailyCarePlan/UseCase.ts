import { handleError, left, Result, right, UseCase } from "@shared";
import { GenerateDailyCarePlanRequest } from "./Request";
import { GenerateDailyCarePlanResponse } from "./Response";
import { DomainDateTime } from "@shared";
import { NextCore } from "@/core/nutrition_care/domain";

export class GenerateDailyCarePlanUseCase
  implements
    UseCase<GenerateDailyCarePlanRequest, GenerateDailyCarePlanResponse>
{
  constructor(
    private readonly orchestratorPort: NextCore.IPatientCareOrchestratorPort
  ) {}

  async execute(
    request: GenerateDailyCarePlanRequest
  ): Promise<GenerateDailyCarePlanResponse> {
    try {
      const sessionRes = await this.orchestratorPort.getPatientCareSession(
        request.sessionId
      );
      if (sessionRes.isFailure) {
        return left(sessionRes);
      }
      const resultRes = await this.orchestratorPort.orchestrate(
        sessionRes.val,
        NextCore.OrchestratorOperation.GENERATE_DAILY_PLAN,
        {
          targetDate: request.targetDate
            ? DomainDateTime.create(request.targetDate).val
            : undefined,
        }
      );
      if (resultRes.isFailure) {
        return left(resultRes);
      }
      const result = resultRes.val;

      return right(
        Result.ok({
          sessionId: request.sessionId,
          success: result.success,
          message: result.message || "Daily care plan generated",
          planGenerated: result.success,
        })
      );
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
