import {
  handleError,
  left,
  Result,
  right,
  UseCase,
  CreateCriterion
} from "@shared";
import { UpdateOrientationReferenceRequest } from "./Request";
import { UpdateOrientationReferenceResponse }from "./Response";
import {
  OrientationReference,
  OrientationReferenceRepository,
  CreateOrientationReference,
} from "../../../../../domain/modules/next/orientation";

export class UpdateOrientationReferenceUseCase
  implements
    UseCase<UpdateOrientationReferenceRequest, UpdateOrientationReferenceResponse>
{
  constructor(private readonly repo: OrientationReferenceRepository) {}

  async execute(
    request: UpdateOrientationReferenceRequest
  ): Promise<UpdateOrientationReferenceResponse> {
    try {
      const orientationRef = await this.repo.getById(request.id);

      const criteria = request.criteria ?? orientationRef.getCriteria().map(c => ({
        id: c.id.toString(),
        code: c.code.unpack(),
        value: c.value.isSuccess ? c.value.val : null,
        operator: c.operator.unpack(),
      }));

      const createProps: CreateOrientationReference = {
        name: request.name ?? orientationRef.getName(),
        code: request.code ?? orientationRef.getCode(),
        criteria: criteria as CreateCriterion[],
        treatmentPhase: request.treatmentPhase ?? orientationRef.getTreatmentPhase(),
      }

      const updatedOrientationRefResult = OrientationReference.create(createProps, request.id);

      if(updatedOrientationRefResult.isFailure) {
        return left(updatedOrientationRefResult);
      }

      await this.repo.save(updatedOrientationRefResult.val);

      return right(Result.ok<void>());
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
