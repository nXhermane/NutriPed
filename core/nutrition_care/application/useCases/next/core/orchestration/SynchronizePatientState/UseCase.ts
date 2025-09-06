import {
  AggregateID,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { SynchronizePatientStateRequest } from "./Request";
import { SynchronizePatientStateResponse } from "./Response";
import { PatientCareOrchestratorPort } from "../../../../../../domain/next/core/services/ports/PatientCareOrchestratorPort";
import { OrchestratorOperation } from "../../../../../../domain/next/core/services/interfaces";

export class SynchronizePatientStateUseCase
  implements
    UseCase<SynchronizePatientStateRequest, SynchronizePatientStateResponse>
{
  constructor(
    private readonly orchestratorPort: PatientCareOrchestratorPort
  ) {}

  async execute(
    request: SynchronizePatientStateRequest
  ): Promise<SynchronizePatientStateResponse> {
    try {
      const session = await this.orchestratorPort.getPatientCareSession(request.sessionId);

      const result = await this.orchestratorPort.orchestrate(
        session,
        OrchestratorOperation.SYNCHRONIZE_STATE,
        {
          patientVariables: request.patientVariables
        }
      );

      return right(Result.ok({
        sessionId: request.sessionId,
        success: result.success,
        message: result.message || "Patient state synchronized",
        stateSynchronized: result.success
      }));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
