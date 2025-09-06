import {
  handleError,
  left,
  Result,
  right,
  UseCase,
  SystemCode,
} from "@shared";
import { CreateCarePhaseReferenceRequest } from "./Request";
import { CreateCarePhaseReferenceResponse } from "./Response";
import { CarePhaseReferenceRepository, CarePhaseReferenceFactory } from "@/core/nutrition_care/domain/modules/carePhase";

export class CreateCarePhaseReferenceUseCase
  implements UseCase<CreateCarePhaseReferenceRequest, CreateCarePhaseReferenceResponse>
{
  constructor(
    private readonly repo: CarePhaseReferenceRepository,
    private readonly factory: CarePhaseReferenceFactory
  ) {}
  async execute(
    request: CreateCarePhaseReferenceRequest
  ): Promise<CreateCarePhaseReferenceResponse> {
    try {
      // Check if care phase with this code already exists
      const codeResult = SystemCode.create(request.data.code);
      if (codeResult.isFailure) {
        return left(codeResult);
      }
      const existingPhase = await this.repo.exist(codeResult.val);
      if (existingPhase) {
        return left(
          Result.fail(
            `The care phase with this code [${request.data.code}] already exists.`
          )
        );
      }

      // Create the care phase entity using factory
      const carePhaseResult = await this.factory.create(request.data);

      if (carePhaseResult.isFailure) {
        return left(carePhaseResult);
      }

      const carePhase = carePhaseResult.val;

      // Save to repository
      await this.repo.save(carePhase);

      return right(Result.ok({ id: carePhase.getID() }));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
