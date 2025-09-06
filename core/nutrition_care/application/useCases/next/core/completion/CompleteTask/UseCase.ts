import {
  AggregateID,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { CompleteTaskRequest } from "./Request";
import { CompleteTaskResponse } from "./Response";
import { PatientCareOrchestratorPort } from "../../../../../../domain/next/core/services/ports/PatientCareOrchestratorPort";

export class CompleteTaskUseCase
  implements
    UseCase<CompleteTaskRequest, CompleteTaskResponse>
{
  constructor(
    private readonly orchestratorPort: PatientCareOrchestratorPort
  ) {}

  async execute(
    request: CompleteTaskRequest
  ): Promise<CompleteTaskResponse> {
    try {
      const resultRes = await this.orchestratorPort.completeTask(
        request.sessionId,
        request.taskId
      );
      if(resultRes.isFailure) {
        return left(resultRes);
      }
      const result = resultRes.val;
      return right(Result.ok({
        sessionId: request.sessionId,
        taskId: request.taskId,
        success: result.success,
        message: result.message || "Task completed successfully"
      }));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
