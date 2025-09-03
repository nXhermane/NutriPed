import {
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { CreateOrientationReferenceRequest } from "./Request";
import { CreateOrientationReferenceResponse } from "./Response";
import {
  OrientationReference,
  OrientationReferenceRepository,
} from "../../../../../domain/modules/next/orientation";

export class CreateOrientationReferenceUseCase
  implements
    UseCase<CreateOrientationReferenceRequest, CreateOrientationReferenceResponse>
{
  constructor(private readonly repo: OrientationReferenceRepository) {}

  async execute(
    request: CreateOrientationReferenceRequest
  ): Promise<CreateOrientationReferenceResponse> {
    try {
      const { name, code, criteria, treatmentPhase } = request;

      const orientationRefResult = OrientationReference.create(
        {
          name,
          code,
          criteria,
          treatmentPhase,
        },
        this.repo.getNextId()
      );

      if (orientationRefResult.isFailure) {
        return left(orientationRefResult);
      }

      await this.repo.save(orientationRefResult.val);

      return right(Result.ok<void>());
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
