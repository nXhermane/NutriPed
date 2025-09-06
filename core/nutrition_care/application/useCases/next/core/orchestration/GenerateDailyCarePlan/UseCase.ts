import {
  AggregateID,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { GenerateDailyCarePlanRequest } from "./Request";
import { GenerateDailyCarePlanResponse } from "./Response";
import { PatientCareOrchestratorPort } from "../../../../../../domain/next/core/services/ports/PatientCareOrchestratorPort";
import { OrchestratorOperation } from "../../../../../../domain/next/core/services/interfaces";
import { DomainDateTime } from "@shared";

export class GenerateDailyCarePlanUseCase
  implements
    UseCase<GenerateDailyCarePlanRequest, GenerateDailyCarePlanResponse>
{
  constructor(
    private readonly orchestratorPort: PatientCareOrchestratorPort
  ) {}

  async execute(
    request: GenerateDailyCarePlanRequest
  ): Promise<GenerateDailyCarePlanResponse> {
    try {
      const session = await this.orchestratorPort.getPatientCareSession(request.sessionId);

      const result = await this.orchestratorPort.orchestrate(
        session,
        OrchestratorOperation.GENERATE_DAILY_PLAN,
        {
          targetDate: request.targetDate ? DomainDateTime.create(request.targetDate).val : undefined
        }
      );

      return right(Result.ok({
        sessionId: request.sessionId,
        success: result.success,
        message: result.message || "Daily care plan generated",
        planGenerated: result.success
      }));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
