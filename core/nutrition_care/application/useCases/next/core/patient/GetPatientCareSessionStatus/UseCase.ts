import {
  AggregateID,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { GetPatientCareSessionStatusRequest } from "./Request";
import { GetPatientCareSessionStatusResponse } from "./Response";
import { PatientCareOrchestratorPort } from "../../../../../../domain/next/core/services/ports/PatientCareOrchestratorPort";

export class GetPatientCareSessionStatusUseCase
  implements
    UseCase<GetPatientCareSessionStatusRequest, GetPatientCareSessionStatusResponse>
{
  constructor(
    private readonly orchestratorPort: PatientCareOrchestratorPort
  ) {}

  async execute(
    request: GetPatientCareSessionStatusRequest
  ): Promise<GetPatientCareSessionStatusResponse> {
    try {
      const status = await this.orchestratorPort.getSessionStatus(request.sessionId);

      return right(Result.ok({
        sessionId: request.sessionId,
        completionStatus: status.completionStatus,
        pendingItems: status.pendingItems,
        nextActions: status.nextActions?.map(action => action.toString()),
        currentRecord: status.currentRecord
      }));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
