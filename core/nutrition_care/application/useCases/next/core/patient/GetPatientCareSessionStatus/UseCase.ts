import {
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { GetPatientCareSessionStatusRequest } from "./Request";
import { GetPatientCareSessionStatusResponse } from "./Response";
import { DailyCareAction } from "@/core/nutrition_care/domain/next";
import { NextCore } from "@/core/nutrition_care/domain";
export class GetPatientCareSessionStatusUseCase
  implements
  UseCase<GetPatientCareSessionStatusRequest, GetPatientCareSessionStatusResponse> {
  constructor(
    private readonly orchestratorPort: NextCore.IPatientCareOrchestratorPort
  ) { }

  async execute(
    request: GetPatientCareSessionStatusRequest
  ): Promise<GetPatientCareSessionStatusResponse> {
    try {
      const statusRes = await this.orchestratorPort.getSessionStatus(request.sessionId);
      if (statusRes.isFailure) {
        return left(statusRes);
      }
      const status = statusRes.val;

      return right(Result.ok({
        sessionId: request.sessionId,
        completionStatus: status.completionStatus,
        pendingItems: status.pendingItems?.map(item => ({
          id: item.id,
          type: item instanceof DailyCareAction ? 'action' : 'task'
        })) || [],
        nextActions: status.nextActions || []
      }));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
