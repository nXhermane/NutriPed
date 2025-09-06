import {
  AggregateID,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { CompleteActionRequest } from "./Request";
import { CompleteActionResponse } from "./Response";
import { PatientCareOrchestratorPort } from "../../../../../../domain/next/core/services/ports/PatientCareOrchestratorPort";

export class CompleteActionUseCase
  implements
    UseCase<CompleteActionRequest, CompleteActionResponse>
{
  constructor(
    private readonly orchestratorPort: PatientCareOrchestratorPort
  ) {}

  async execute(
    request: CompleteActionRequest
  ): Promise<CompleteActionResponse> {
    try {
      const result = await this.orchestratorPort.completeAction(
        request.sessionId,
        request.actionId
      );

      return right(Result.ok({
        sessionId: request.sessionId,
        actionId: request.actionId,
        success: result.success,
        message: result.message || "Action completed successfully"
      }));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
