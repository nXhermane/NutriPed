import {
  AggregateID,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { SubmitUserResponseRequest } from "./Request";
import { SubmitUserResponseResponse } from "./Response";
import { PatientCareOrchestratorPort } from "../../../../../../domain/next/core/services/ports/PatientCareOrchestratorPort";

export class SubmitUserResponseUseCase
  implements
    UseCase<SubmitUserResponseRequest, SubmitUserResponseResponse>
{
  constructor(
    private readonly orchestratorPort: PatientCareOrchestratorPort
  ) {}

  async execute(
    request: SubmitUserResponseRequest
  ): Promise<SubmitUserResponseResponse> {
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
        message: result.message || "Response submitted successfully"
      }));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
