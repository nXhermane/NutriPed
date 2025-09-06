import {
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { CompleteActionRequest } from "./Request";
import { CompleteActionResponse } from "./Response";
import { NextCore } from "@/core/nutrition_care/domain";


export class CompleteActionUseCase
  implements
    UseCase<CompleteActionRequest, CompleteActionResponse>
{
  constructor(
    private readonly orchestratorPort: NextCore.IPatientCareOrchestratorPort
  ) {}

  async execute(
    request: CompleteActionRequest
  ): Promise<CompleteActionResponse> {
    try {
      const resultRes = await this.orchestratorPort.completeAction(
        request.sessionId,
        request.actionId
      );
      if(resultRes.isFailure) {
        return left(resultRes)
      }
      const result = resultRes.val;
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
