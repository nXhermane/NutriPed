import {
  AggregateID,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { ResumePatientCareSessionRequest } from "./Request";
import { ResumePatientCareSessionResponse } from "./Response";
import { PatientCareOrchestratorPort } from "../../../../../../domain/next/core/services/ports/PatientCareOrchestratorPort";

export class ResumePatientCareSessionUseCase
  implements
    UseCase<ResumePatientCareSessionRequest, ResumePatientCareSessionResponse>
{
  constructor(
    private readonly orchestratorPort: PatientCareOrchestratorPort
  ) {}

  async execute(
    request: ResumePatientCareSessionRequest
  ): Promise<ResumePatientCareSessionResponse> {
    try {
      const session = await this.orchestratorPort.getPatientCareSession(request.sessionId);
      const status = await this.orchestratorPort.getSessionStatus(request.sessionId);

      return right(Result.ok({
        sessionId: session.id,
        status: status.completionStatus
      }));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
