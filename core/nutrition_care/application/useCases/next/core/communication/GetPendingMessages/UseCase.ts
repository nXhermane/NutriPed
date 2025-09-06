import {
  AggregateID,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { GetPendingMessagesRequest } from "./Request";
import { GetPendingMessagesResponse } from "./Response";
import { PatientCareOrchestratorPort } from "../../../../../../domain/next/core/services/ports/PatientCareOrchestratorPort";

export class GetPendingMessagesUseCase
  implements
    UseCase<GetPendingMessagesRequest, GetPendingMessagesResponse>
{
  constructor(
    private readonly orchestratorPort: PatientCareOrchestratorPort
  ) {}

  async execute(
    request: GetPendingMessagesRequest
  ): Promise<GetPendingMessagesResponse> {
    try {
      const messages = await this.orchestratorPort.getPendingMessages(request.sessionId);

      return right(Result.ok({
        sessionId: request.sessionId,
        messages,
        count: messages.length
      }));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
