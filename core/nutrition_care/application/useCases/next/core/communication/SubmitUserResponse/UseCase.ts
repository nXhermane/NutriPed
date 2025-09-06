import {
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { SubmitUserResponseRequest } from "./Request";
import { SubmitUserResponseResponse } from "./Response";
import { NextCore } from "@/core/nutrition_care/domain";

export class SubmitUserResponseUseCase
  implements
    UseCase<SubmitUserResponseRequest, SubmitUserResponseResponse>
{
  constructor(
    private readonly orchestratorPort: NextCore.IPatientCareOrchestratorPort
  ) {}

  async execute(
    request: SubmitUserResponseRequest
  ): Promise<SubmitUserResponseResponse> {
    try {
      const resultRes = await this.orchestratorPort.handleUserResponse(
        request.sessionId,
        request.messageId,
        request.response,
        request.decisionData
      );
      if(resultRes.isFailure) {
        return left(resultRes)
      }
      const result = resultRes.val;

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
