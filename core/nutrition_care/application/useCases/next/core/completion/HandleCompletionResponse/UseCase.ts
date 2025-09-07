import { handleError, left, Result, right, UseCase } from "@shared";
import { HandleCompletionResponseRequest } from "./Request";
import { HandleCompletionResponseResponse } from "./Response";
import { NextCore } from "@/core/nutrition_care/domain";

export class HandleCompletionResponseUseCase
  implements
    UseCase<HandleCompletionResponseRequest, HandleCompletionResponseResponse>
{
  constructor(
    private readonly orchestratorPort: NextCore.IPatientCareOrchestratorPort
  ) {}

  async execute(
    request: HandleCompletionResponseRequest
  ): Promise<HandleCompletionResponseResponse> {
    try {
      const resultRes = await this.orchestratorPort.handleUserResponse(
        request.sessionId,
        request.messageId,
        request.response,
        request.decisionData
      );
      if (resultRes.isFailure) {
        return left(resultRes);
      }
      const result = resultRes.val;
      return right(
        Result.ok({
          sessionId: request.sessionId,
          messageId: request.messageId,
          success: result.success,
          message: result.message || "Response handled successfully",
        })
      );
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
