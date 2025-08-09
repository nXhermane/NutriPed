import {
  UseCase,
  Result,
  AppServiceResponse,
  handleError,
  GenerateUniqueId,
} from "@shared";
import { IPatientCareSessionRepository } from "../../../../domain/core/ports/secondary/IPatientCareSessionRepository";
import { AdmitPatientToCNTRequest } from "./Request";
import { AdmitPatientToCNTResponse } from "./Response";
import {
    IOrientationService,
    ITherapeuticMilkAdvisorService,
} from "../../../../domain/modules";
import { PatientCareSessionFactory } from "../../../../domain/core/factories/PatientCareSessionFactory";

// This UseCase is not yet implemented. It will be in Step 4.
// This file just defines the structure.

export class AdmitPatientToCNTUseCase extends UseCase<
  AdmitPatientToCNTRequest,
  AdmitPatientToCNTResponse
> {
  constructor(
    private readonly patientCareSessionRepository: IPatientCareSessionRepository,
    private readonly orientationService: IOrientationService,
    private readonly milkAdvisorService: ITherapeuticMilkAdvisorService,
    // private readonly medicineAdvisorService: IMedicineAdvisorService, // To be added
    private readonly patientCareSessionFactory: PatientCareSessionFactory,
    private readonly idGenerator: GenerateUniqueId,
  ) {
    super();
  }

  public async execute(
    request: AdmitPatientToCNTRequest
  ): Promise<AdmitPatientToCNTResponse> {
    try {
      // Implementation will be done in Step 4 of the plan.
      // The logic will involve:
      // 1. Validating the request.
      // 2. Building the necessary contexts for the domain services.
      // 3. Calling the orientation service to confirm the CNT orientation.
      // 4. Creating the PatientCareSession aggregate via its factory.
      // 5. Calling the milk advisor service to get the F-75 prescription.
      // 6. Calling a medicine advisor service for systematic antibiotics.
      // 7. Adding these prescriptions as actions to the session's journal.
      // 8. Persisting the new session using the repository.
      // 9. Returning the new session's ID.

      return Result.ok<string>("UseCase not implemented yet.");
    } catch (e) {
      return handleError(e);
    }
  }
}
