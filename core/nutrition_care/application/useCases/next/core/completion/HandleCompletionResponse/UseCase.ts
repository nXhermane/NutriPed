import {
  AggregateID,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { HandleCompletionResponseRequest } from "./Request";
import { HandleCompletionResponseResponse } from "./Response";
import { PatientCareOrchestratorPort } from "../../../../../../domain/next/core/services/ports/PatientCareOrchestratorPort";

export class HandleCompletionResponseUseCase
  implements
    UseCase<HandleCompletionResponseRequest, HandleCompletionResponseResponse>
{
  constructor(
    private readonly orchestratorPort: PatientCareOrchestratorPort
  ) {}

  async execute(
    request: HandleCompletionResponseRequest
  ): Promise<HandleCompletionResponseResponse> {
    try {
      const result = await this.orchestratorPort.handleUserResponse(
        request.sessionId,
        request.messageId,
        request.response,
        request.decisionData
      );

      return right(Result.ok({
        sessionId: request.sessionId,
        messageId: request.messageId,
        success: result.success,
        message: result.message || "Response handled successfully"
      }));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
