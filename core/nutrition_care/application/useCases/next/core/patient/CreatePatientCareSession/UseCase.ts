import { handleError, left, Result, right, UseCase } from "@shared";
import { CreatePatientCareSessionRequest } from "./Request";
import { CreatePatientCareSessionResponse } from "./Response";
import { NextCore } from "@/core/nutrition_care/domain";

export class CreatePatientCareSessionUseCase
  implements
    UseCase<CreatePatientCareSessionRequest, CreatePatientCareSessionResponse>
{
  constructor(
    private readonly orchestratorPort: NextCore.IPatientCareOrchestratorPort
  ) {}

  async execute(
    request: CreatePatientCareSessionRequest
  ): Promise<CreatePatientCareSessionResponse> {
    try {
      const sessionRes =
        await this.orchestratorPort.initializePatientCareSession(
          request.patientId,
          request.phaseCode
        );
      if (sessionRes.isFailure) {
        return left(sessionRes);
      }

      return right(Result.ok({ sessionId: sessionRes.val.id }));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
