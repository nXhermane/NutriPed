import {
  AggregateID,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { StartContinuousOrchestrationRequest } from "./Request";
import { StartContinuousOrchestrationResponse } from "./Response";
import { PatientCareOrchestratorPort } from "../../../../../../domain/next/core/services/ports/PatientCareOrchestratorPort";

export class StartContinuousOrchestrationUseCase
  implements
    UseCase<StartContinuousOrchestrationRequest, StartContinuousOrchestrationResponse>
{
  constructor(
    private readonly orchestratorPort: PatientCareOrchestratorPort
  ) {}

  async execute(
    request: StartContinuousOrchestrationRequest
  ): Promise<StartContinuousOrchestrationResponse> {
    try {
      const session = await this.orchestratorPort.getPatientCareSession(request.sessionId);

      const result = await this.orchestratorPort.orchestrateWithContinuousEvaluation(
        session,
        {
          patientVariables: request.patientVariables,
          maxIterations: request.maxIterations
        }
      );

      return right(Result.ok({
        sessionId: request.sessionId,
        success: result.success,
        message: result.message || "Continuous orchestration completed"
      }));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
