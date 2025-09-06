import {
  ApplicationMapper,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { GetPendingMessagesRequest } from "./Request";
import { GetPendingMessagesResponse } from "./Response";
import { NextCore } from "@/core/nutrition_care/domain";
import { MessageDto } from "@/core/nutrition_care/application/dtos/next/core";

export class GetPendingMessagesUseCase
  implements
  UseCase<GetPendingMessagesRequest, GetPendingMessagesResponse> {
  constructor(
    private readonly messageMapper: ApplicationMapper<NextCore.Message, MessageDto>,
    private readonly orchestratorPort: NextCore.IPatientCareOrchestratorPort
  ) { }

  async execute(
    request: GetPendingMessagesRequest
  ): Promise<GetPendingMessagesResponse> {
    try {
      const messageRes = await this.orchestratorPort.getPendingMessages(request.sessionId);
      if (messageRes.isFailure) {
        return left(messageRes);
      }
      const messages = messageRes.val.map(message => this.messageMapper.toResponse(message));
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
