import {
  ApplicationMapper,
  Criterion,
  handleError,
  left,
  Result,
  right,
  SystemCode,
  UseCase,
} from "@shared";
import { UpdateOrientationReferenceRequest } from "./Request";
import { UpdateOrientationReferenceResponse } from "./Response";
import {
  OrientationReference,
  OrientationReferenceRepository,
} from "../../../../../domain/modules/next/orientation";
import { OrientationReferenceDto } from "../../../../dtos/next/orientation";

export class UpdateOrientationReferenceUseCase
  implements
    UseCase<
      UpdateOrientationReferenceRequest,
      UpdateOrientationReferenceResponse
    >
{
  constructor(
    private readonly repo: OrientationReferenceRepository,
    private readonly mapper: ApplicationMapper<
      OrientationReference,
      OrientationReferenceDto
    >
  ) {}

  async execute(
    request: UpdateOrientationReferenceRequest
  ): Promise<UpdateOrientationReferenceResponse> {
    try {
      const orientationRef = await this.repo.getById(request.id);

      if (request.name) {
        orientationRef.changeName(request.name);
      }
      if (request.code) {
        const codeRes = SystemCode.create(request.code);
        if (codeRes.isFailure) return left(codeRes);
        orientationRef.changeCode(codeRes.val);
      }
      if (request.criteria) {
        const criterionRes = request.criteria.map(Criterion.create);
        const combinedRes = Result.combine(criterionRes);
        if (combinedRes.isFailure) return left(combinedRes);
        orientationRef.changeCriteria(criterionRes.map(res => res.val));
      }
      if (request.treatmentPhase) {
        const treatmentPhaseRes = SystemCode.create(request.treatmentPhase);
        if (treatmentPhaseRes.isFailure) return left(treatmentPhaseRes);
        orientationRef.changeTreatmentPhase(treatmentPhaseRes.val);
      }

      await this.repo.save(orientationRef);

      return right(Result.ok(this.mapper.toResponse(orientationRef)));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
