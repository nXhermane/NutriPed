import {
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { CreatePatientCareSessionRequest } from "./Request";
import { CreatePatientCareSessionResponse } from "./Response";
import { PatientCareOrchestratorPort } from "../../../../../../domain/next/core/services/ports/PatientCareOrchestratorPort";

export class CreatePatientCareSessionUseCase
  implements
    UseCase<CreatePatientCareSessionRequest, CreatePatientCareSessionResponse>
{
  constructor(
    private readonly orchestratorPort: PatientCareOrchestratorPort
  ) {}

  async execute(
    request: CreatePatientCareSessionRequest
  ): Promise<CreatePatientCareSessionResponse> {
    try {
      const session = await this.orchestratorPort.initializePatientCareSession(
        request.patientId,
        request.phaseCode,
        request.patientVariables
      );

      return right(Result.ok({ sessionId: session.id }));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
