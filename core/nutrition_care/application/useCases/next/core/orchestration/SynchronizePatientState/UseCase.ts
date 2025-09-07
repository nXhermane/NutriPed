import { handleError, left, Result, right, UseCase } from "@shared";
import { SynchronizePatientStateRequest } from "./Request";
import { SynchronizePatientStateResponse } from "./Response";
import { NextCore } from "@/core/nutrition_care/domain";

export class SynchronizePatientStateUseCase
  implements
    UseCase<SynchronizePatientStateRequest, SynchronizePatientStateResponse>
{
  constructor(
    private readonly orchestratorPort: NextCore.IPatientCareOrchestratorPort
  ) {}

  async execute(
    request: SynchronizePatientStateRequest
  ): Promise<SynchronizePatientStateResponse> {
    try {
      const sessionRes = await this.orchestratorPort.getPatientCareSession(
        request.sessionId
      );
      if (sessionRes.isFailure) {
        return left(sessionRes);
      }
      const resultRes = await this.orchestratorPort.orchestrate(
        sessionRes.val,
        NextCore.OrchestratorOperation.SYNCHRONIZE_STATE,
        {
          patientVariables: request.patientVariables,
        }
      );
      const result = resultRes.val;
      return right(
        Result.ok({
          sessionId: request.sessionId,
          success: result.success,
          message: result.message || "Patient state synchronized",
          stateSynchronized: result.success,
        })
      );
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
