import { handleError, left, Result, right, UseCase } from "@shared";
import { StartContinuousOrchestrationRequest } from "./Request";
import { StartContinuousOrchestrationResponse } from "./Response";
import { NextCore } from "@/core/nutrition_care/domain";

export class StartContinuousOrchestrationUseCase
  implements
    UseCase<
      StartContinuousOrchestrationRequest,
      StartContinuousOrchestrationResponse
    >
{
  constructor(
    private readonly orchestratorPort: NextCore.IPatientCareOrchestratorPort
  ) {}

  async execute(
    request: StartContinuousOrchestrationRequest
  ): Promise<StartContinuousOrchestrationResponse> {
    try {
      const sessionRes = await this.orchestratorPort.getPatientCareSession(
        request.sessionId
      );
      if (sessionRes.isFailure) {
        return left(sessionRes);
      }
      const resultRes =
        await this.orchestratorPort.orchestrateWithContinuousEvaluation(
          sessionRes.val,
          {
            patientVariables: request.patientVariables,
            maxIterations: request.maxIterations,
          }
        );
      const result = resultRes.val;

      return right(
        Result.ok({
          sessionId: request.sessionId,
          success: result.success,
          message: result.message || "Continuous orchestration completed",
        })
      );
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
