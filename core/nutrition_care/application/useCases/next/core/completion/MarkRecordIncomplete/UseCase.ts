import { handleError, left, Result, right, UseCase } from "@shared";
import { MarkRecordIncompleteRequest } from "./Request";
import { MarkRecordIncompleteResponse } from "./Response";
import { NextCore } from "@/core/nutrition_care/domain";

export class MarkRecordIncompleteUseCase
  implements UseCase<MarkRecordIncompleteRequest, MarkRecordIncompleteResponse>
{
  constructor(
    private readonly orchestratorPort: NextCore.IPatientCareOrchestratorPort
  ) {}

  async execute(
    request: MarkRecordIncompleteRequest
  ): Promise<MarkRecordIncompleteResponse> {
    try {
      const resultRes = await this.orchestratorPort.markRecordIncomplete(
        request.sessionId
      );
      if (resultRes.isFailure) {
        return left(resultRes);
      }
      const result = resultRes.val;
      return right(
        Result.ok({
          sessionId: request.sessionId,
          success: result.success,
          message: result.message || "Record marked as incomplete",
        })
      );
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
