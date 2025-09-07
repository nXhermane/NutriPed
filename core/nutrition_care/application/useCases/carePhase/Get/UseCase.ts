import {
  ApplicationMapper,
  handleError,
  left,
  Result,
  right,
  UseCase,
  SystemCode,
  Guard,
} from "@shared";
import { GetCarePhaseReferenceRequest } from "./Request";
import { GetCarePhaseReferenceResponse } from "./Response";
import { CarePhaseDto } from "@/core/nutrition_care/application/dtos";
import {
  CarePhaseReferenceRepository,
  CarePhaseReference,
} from "@/core/nutrition_care/domain/modules/carePhase";

export class GetCarePhaseReferenceUseCase
  implements
    UseCase<GetCarePhaseReferenceRequest, GetCarePhaseReferenceResponse>
{
  constructor(
    private readonly repo: CarePhaseReferenceRepository,
    private readonly mapper: ApplicationMapper<
      CarePhaseReference,
      CarePhaseDto.CarePhaseReferenceDto
    >
  ) {}
  async execute(
    request: GetCarePhaseReferenceRequest
  ): Promise<GetCarePhaseReferenceResponse> {
    try {
      const carePhases = [];
      if (request.code && !request.id) {
        const codeRes = SystemCode.create(request.code);
        if (codeRes.isFailure) {
          return left(codeRes);
        }
        const phase = await this.repo.getByCode(codeRes.val);
        carePhases.push(phase);
      } else if (request.id && !request.code) {
        const phase = await this.repo.getById(request.id);
        carePhases.push(phase);
      } else {
        const phases = await this.repo.getAll();
        carePhases.push(...phases);
      }
      if (Guard.isEmpty(carePhases).succeeded) {
        return left(Result.fail("The care phase not found."));
      }

      return right(
        Result.ok(
          carePhases.map(carePhase => this.mapper.toResponse(carePhase))
        )
      );
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
