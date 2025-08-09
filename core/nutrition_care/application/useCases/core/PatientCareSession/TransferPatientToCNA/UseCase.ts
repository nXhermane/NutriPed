import {
  UseCase,
  Result,
  AppServiceResponse,
  handleError,
} from "@shared";
import { IPatientCareSessionRepository } from "../../../../domain/core/ports/secondary/IPatientCareSessionRepository";
import { TransferPatientToCNARequest } from "./Request";
import { TransferPatientToCNAResponse } from "./Response";

// This UseCase is not yet implemented. It will be in Step 4 (or later).
// This file just defines the structure.

export class TransferPatientToCNAUseCase extends UseCase<
  TransferPatientToCNARequest,
  TransferPatientToCNAResponse
> {
  constructor(
    private readonly patientCareSessionRepository: IPatientCareSessionRepository
  ) {
    super();
  }

  public async execute(
    request: TransferPatientToCNARequest
  ): Promise<TransferPatientToCNAResponse> {
    try {
      // Implementation will be done in a later step.
      // The logic will involve:
      // 1. Loading the PatientCareSession.
      // 2. Calling a new domain method like `canBeTransferredOut()` on the session.
      // 3. If the check passes, update the session's orientation to CNA.
      // 4. Saving the updated session.
      // 5. Returning a success result.

      return Result.ok<void>(); // Placeholder
    } catch (e) {
      return handleError(e);
    }
  }
}
