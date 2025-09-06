import {
  AggregateID,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { MarkRecordIncompleteRequest } from "./Request";
import { MarkRecordIncompleteResponse } from "./Response";
import { PatientCareOrchestratorPort } from "../../../../../../domain/next/core/services/ports/PatientCareOrchestratorPort";

export class MarkRecordIncompleteUseCase
  implements
    UseCase<MarkRecordIncompleteRequest, MarkRecordIncompleteResponse>
{
  constructor(
    private readonly orchestratorPort: PatientCareOrchestratorPort
  ) {}

  async execute(
    request: MarkRecordIncompleteRequest
  ): Promise<MarkRecordIncompleteResponse> {
    try {
      const result = await this.orchestratorPort.markRecordIncomplete(request.sessionId);

      return right(Result.ok({
        sessionId: request.sessionId,
        success: result.success,
        message: result.message || "Record marked as incomplete"
      }));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
