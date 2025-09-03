import {
  ApplicationMapper,
  Guard,
  handleError,
  left,
  Result,
  right,
  SystemCode,
  UseCase,
} from "@shared";
import { GetOrientationReferenceRequest } from "./Request";
import { GetOrientationReferenceResponse } from "./Response";
import {
  OrientationReference,
  OrientationReferenceRepository,
} from "../../../../../domain/modules/next/orientation";
import { OrientationReferenceDto } from "../../../../dtos/next/orientation";

export class GetOrientationReferenceUseCase
  implements
    UseCase<GetOrientationReferenceRequest, GetOrientationReferenceResponse>
{
  constructor(
    private readonly repo: OrientationReferenceRepository,
    private readonly mapper: ApplicationMapper<
      OrientationReference,
      OrientationReferenceDto
    >
  ) {}
  async execute(
    request: GetOrientationReferenceRequest
  ): Promise<GetOrientationReferenceResponse> {
    try {
      const orientationRefs: OrientationReference[] = [];

      if (request.orientationRefId && !request.orientationRefCode) {
        const orientationRef = await this.repo.getById(
          request.orientationRefId
        );
        orientationRefs.push(orientationRef);
      } else if (request.orientationRefCode && !request.orientationRefId) {
        const codeRes = SystemCode.create(request.orientationRefCode);
        if (codeRes.isFailure) return left(codeRes);
        const orientationRef = await this.repo.getByCode(codeRes.val);
        orientationRefs.push(orientationRef);
      } else {
        const allOrientationRefs = await this.repo.getAll();
        orientationRefs.push(...allOrientationRefs);
      }

      if (Guard.isEmpty(orientationRefs).succeeded) {
        return left(Result.fail("The Orientation Ref not found."));
      }

      return right(Result.ok(orientationRefs.map(entity => this.mapper.toResponse(entity))));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
